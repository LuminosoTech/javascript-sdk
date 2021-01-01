import "jest";
import { LogLevel, LogHandler, LoggerFacade } from "../src/models";

import { ConsoleLogHandler } from "../src/log-handler";
import { ErrorHandler } from "../src/errors";

describe("logger", () => {
  afterEach(() => {});

  describe("DefaultLogger", () => {
    let stubLogger: LogHandler;
    let logger: LoggerFacade;
    let stubErrorHandler: ErrorHandler;

    beforeEach(() => {
      stubLogger = {
        log: jest.fn(),
      };
      stubErrorHandler = {
        handleError: jest.fn(),
      };
    });
  });
});
