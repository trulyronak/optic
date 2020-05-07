package com.useoptic.diff.shapes

import com.useoptic.contexts.rfc.RfcState
import com.useoptic.contexts.shapes.Commands.{FieldId, ShapeId, ShapeParameterId}
import com.useoptic.contexts.shapes.ShapesHelper.CoreShapeKind
import com.useoptic.contexts.shapes.{FlattenedField, ShapeEntity, ShapesState}
import com.useoptic.diff.interactions.InteractionTrail
import com.useoptic.diff.shapes.SpecResolvers.{ChoiceOutput, ParameterBindings, ResolvedTrail}
import com.useoptic.types.capture.{HttpInteraction, JsonLike}
import io.circe.Json
import scalaz.Memo

/*
Cache valid when class instance in memory
 */

class MemoizedResolvers(spec: RfcState) {

  val resolveTrailToCoreShape =  Memo.mutableHashMapMemo[(ShapeTrail, ParameterBindings), ResolvedTrail]{
    case ((a,b)) => SpecResolvers.resolveTrailToCoreShape(spec, a,b)
  }

  val resolveTrailToCoreShapeFromParent =  Memo.mutableHashMapMemo[(ResolvedTrail, Seq[ShapeTrailPathComponent]), ResolvedTrail]{
    case ((a,b)) => SpecResolvers.resolveTrailToCoreShapeFromParent(spec, a,b)
  }

  val flattenChoice =  Memo.mutableHashMapMemo[(ShapeTrail, Seq[ShapeTrailPathComponent], ParameterBindings), Seq[ChoiceOutput]]{
    case ((a,b, c)) => SpecResolvers.flattenChoice(spec, a, b, c)
  }

  val listTrailChoices =  Memo.mutableHashMapMemo[(ShapeTrail, ParameterBindings), Seq[ChoiceOutput]]{
    case ((a,b)) => SpecResolvers.listTrailChoices(spec, a, b)
  }

  val resolveTrailPath =  Memo.mutableHashMapMemo[(ResolvedTrail, ShapeTrailPathComponent), ResolvedTrail]{
    case ((a,b)) => SpecResolvers.resolveTrailPath(spec.shapesState, a, b)
  }

  val resolveParameterToShape =  Memo.mutableHashMapMemo[(ShapeId, ShapeParameterId, ParameterBindings),  Option[ShapeEntity]]{
    case ((a,b, c)) => SpecResolvers.resolveParameterToShape(spec.shapesState, a, b, c)
  }

  val resolveBaseObject =  Memo.mutableHashMapMemo[(ShapeId),  ShapeEntity]{
    case ((a)) => SpecResolvers.resolveBaseObject(a)(spec.shapesState)
  }

  val resolveToBaseShapeId =  Memo.mutableHashMapMemo[(ShapeId),  ShapeId]{
    case ((a)) => SpecResolvers.resolveToBaseShapeId(a)(spec.shapesState)
  }

  val resolveFieldToShapeEntity =  Memo.mutableHashMapMemo[(FieldId, ParameterBindings),  (FlattenedField, Option[ShapeEntity])]{
    case ((a, b)) => SpecResolvers.resolveFieldToShapeEntity(spec.shapesState, a, b)
  }

  val resolveFieldToShape =  Memo.mutableHashMapMemo[(FieldId, ParameterBindings),  (Option[ResolvedTrail])]{
    case ((a, b)) => SpecResolvers.resolveFieldToShape(spec.shapesState, a, b)
  }

  val tryResolveFieldFromKey =  Memo.mutableHashMapMemo[(ShapeEntity, String),  (Option[FieldId])]{
    case ((a, b)) => SpecResolvers.tryResolveFieldFromKey(spec.shapesState, a, b)
  }

  val tryResolveJson =  Memo.mutableHashMapMemo[(InteractionTrail, JsonTrail, HttpInteraction),  (Option[Json])]{
    case ((a, b, c)) => SpecResolvers.tryResolveJson(a, b, c)
  }

  val tryResolveJsonLike =  Memo.mutableHashMapMemo[(InteractionTrail, JsonTrail, HttpInteraction),  (Option[JsonLike])]{
    case ((a, b, c)) => SpecResolvers.tryResolveJsonLike(a, b, c)
  }

  val tryResolveJsonTrail =  Memo.mutableHashMapMemo[(JsonTrail, Option[JsonLike]),  (Option[JsonLike])]{
    case ((a, b)) => SpecResolvers.tryResolveJsonTrail(a, b)
  }

  val jsonToCoreKind =  Memo.mutableHashMapMemo[(JsonLike),  (CoreShapeKind)]{
    case ((a)) => SpecResolvers.jsonToCoreKind(a)
  }


}