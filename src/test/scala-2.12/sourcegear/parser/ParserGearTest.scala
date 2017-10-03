package sourcegear.parser

import Fixture.TestBase
import Fixture.compilerUtils.ParserUtils
import better.files.File
import play.api.libs.json.{JsObject, JsString, Json}
import com.opticdev.core.sdk.SdkDescription
import com.opticdev.core.sdk.descriptions.{ChildrenRule, CodeComponent, PropertyRule}
import com.opticdev.core.sdk.descriptions.enums.ComponentEnums.{Literal, Token}
import com.opticdev.core.sdk.descriptions.enums.FinderEnums.{Containing, Entire, Starting}
import com.opticdev.core.sdk.descriptions.enums.Finders.StringFinder
import com.opticdev.core.sdk.descriptions.enums.RuleEnums.Any
import com.opticdev.core.sourcegear.SourceGearContext
import com.opticdev.core.sourcegear.gears.parsing.{ParseAsModel, ParseGear}

import scala.collection.mutable.ListBuffer
import scala.io.Source

class ParserGearTest extends TestBase with ParserUtils {

  describe("ParserGear") {

    describe("Matching and extracting") {
      it("Can build a valid description from snippet") {
        val block = "var hello = require('world')"

        val parseGear = parseGearFromSnippetWithComponents("var hello = require('world')", Vector())

        assert(parseGear.description.toString == """NodeDescription(AstType(VariableDeclaration,Javascript),Range 0 until 28,Child(0,null,false),Map(kind -> StringProperty(var)),Vector(NodeDescription(AstType(VariableDeclarator,Javascript),Range 4 until 28,Child(0,declarations,true),Map(),Vector(NodeDescription(AstType(Identifier,Javascript),Range 4 until 9,Child(0,id,false),Map(name -> StringProperty(hello)),Vector(),Vector()), NodeDescription(AstType(CallExpression,Javascript),Range 12 until 28,Child(0,init,false),Map(),Vector(NodeDescription(AstType(Literal,Javascript),Range 20 until 27,Child(0,arguments,true),Map(value -> StringProperty(world)),Vector(),Vector()), NodeDescription(AstType(Identifier,Javascript),Range 12 until 19,Child(0,callee,false),Map(name -> StringProperty(require)),Vector(),Vector())),Vector())),Vector())),Vector())""")
      }

      it("Can match its original snippet to the description") {
        val parseGear = parseGearFromSnippetWithComponents("var hello = require('world')", Vector())

        val block = "var hello = require('world')"

        val parsedSample = sample(block)
        val result = parseGear.matches(parsedSample.entryChildren.head)(parsedSample.astGraph, block, sourceGearContext)
        assert(result.isDefined)
      }

      it("fails to match a different snippet than the description") {
        val parseGear = parseGearFromSnippetWithComponents("var hello = require('world')", Vector())

        val block = "var goodbye = notRequire('nation')"

        val parsedSample = sample(block)
        val result = parseGear.matches(parsedSample.entryChildren.head)(parsedSample.astGraph, block, sourceGearContext)
        assert(!result.isDefined)

      }

      describe("with rules") {

        it("Matches any value for a token component/extracts value") {
          val parseGear = parseGearFromSnippetWithComponents("var hello = require('world')", Vector(
            //this causes any token rule to be applied
            CodeComponent(Token, "definedAs", StringFinder(Entire, "hello"))
          ))

          val block = "var otherValue = require('world')"

          val parsedSample = sample(block)
          val result = parseGear.matches(parsedSample.entryChildren.head, true)(parsedSample.astGraph, block, sourceGearContext)
          assert(result.isDefined)

          assert(result.get.modelNode.value == JsObject(Seq("definedAs" -> JsString("otherValue"))))
        }

        it("works for property rules") {

          val customRules = Vector(PropertyRule(StringFinder(Starting, "var"), "kind", "ANY"))

          val parseGear = parseGearFromSnippetWithComponents("var hello = require('world')", Vector(
            //this causes any token rule to be applied
            CodeComponent(Token, "definedAs", StringFinder(Entire, "hello"))
          ), customRules)

          //different kind operator var -> let
          val block = "let otherValue = require('world')"

          val parsedSample = sample(block)
          val result = parseGear.matches(parsedSample.entryChildren.head, true)(parsedSample.astGraph, block, sourceGearContext)
          assert(result.isDefined)
          assert(result.get.modelNode.value == JsObject(Seq("definedAs" -> JsString("otherValue"))))

        }

        describe("for children") {

          it("Matches Any") {
            val customRules = Vector(ChildrenRule(StringFinder(Starting, "{"), Any))

            val parseGear = parseGearFromSnippetWithComponents("function hello () { }", Vector(), customRules)

            val block = "function hello () { return hello }"

            val parsedSample = sample(block)

            val result = parseGear.matches(parsedSample.entryChildren.head, true)(parsedSample.astGraph, block, sourceGearContext)

            assert(result.isDefined)

          }

          it("Will not match Any without rule") {

            val parseGear = parseGearFromSnippetWithComponents("function hello () { }", Vector())

            val block = "function hello () { return hello }"

            val parsedSample = sample(block)

            val result = parseGear.matches(parsedSample.entryChildren.head, true)(parsedSample.astGraph, block, sourceGearContext)

            assert(!result.isDefined)

          }

        }

      }

      describe("with extractors") {

        it("Extracts definedAs (token) and pathTo (literal) from an import") {
          val parseGear = parseGearFromSnippetWithComponents("var hello = require('world')", Vector(
            CodeComponent(Token, "definedAs", StringFinder(Entire, "hello")),
            CodeComponent(Literal, "pathTo", StringFinder(Containing, "world"))
          ))

          val block = "var otherValue = require('that-lib')"

          val parsedSample = sample(block)
          val result = parseGear.matches(parsedSample.entryChildren.head, true)(parsedSample.astGraph, block, sourceGearContext)
          assert(result.isDefined)

          val expected = JsObject(Seq("definedAs" -> JsString("otherValue"), "pathTo" -> JsString("that-lib")))
          assert(result.get.modelNode.value == expected)
        }
      }
    }

  }

}
