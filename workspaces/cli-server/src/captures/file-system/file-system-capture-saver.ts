import {IApiInteraction, ICapture} from '@useoptic/domain';
import Bottleneck from 'bottleneck';
import * as fs from 'fs-extra';
import * as path from 'path';
import {ICaptureSaver} from './file-system-capture-loader';
import {userDebugLogger} from '../../logger';
import * as avro from 'avsc';

interface IFileSystemCaptureSaverConfig {
  captureBaseDirectory: string
}

export const schema = require('@useoptic/domain/build/domain-types/avro-schemas/capture.json');
export const serdes = avro.Type.forSchema(schema);

export const captureFileSuffix = '.optic-capture.json';

class FileSystemCaptureSaver implements ICaptureSaver {
  private batcher: Bottleneck.Batcher = new Bottleneck.Batcher({maxSize: 100, maxTime: 1000});
  private batchCount: number = 0;

  constructor(private config: IFileSystemCaptureSaverConfig) {

  }

  async init(captureId: string) {
    const outputDirectory = path.join(this.config.captureBaseDirectory, captureId);
    await fs.ensureDir(outputDirectory);
    this.batcher.on('batch', async (items: IApiInteraction[]) => {
      userDebugLogger(`writing batch ${this.batchCount}`);
      const outputFile = path.join(outputDirectory, `${this.batchCount}${captureFileSuffix}`);
      const output: ICapture = {
        groupingIdentifiers: {
          agentGroupId: 'agent-group-id',
          agentId: 'agent-id',
          batchId: 'batch-id',
          captureId: 'capture-id'
        },
        batchItems: [
          {
            uuid: 'ddd',
            omitted: [],
            request: {
              headers: [],
              host: 'hhh',
              method: 'mmm',
              path: '/ppp',
              queryString: ''
            },
            response: {
              headers: [],
              statusCode: 200
            }
          }
        ]
      };
      try {
        const serialized = serdes.toBuffer(output);
        await fs.writeFile(outputFile, serialized);
        this.batchCount += 1;
      } catch (e) {
        console.error(e);
      }
    });
  }

  async save(sample: IApiInteraction) {
    // don't await flush, just enqueue
    this.batcher.add(sample);
  }
}

export {
  FileSystemCaptureSaver
};
