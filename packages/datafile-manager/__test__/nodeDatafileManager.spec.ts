import NodeDatafileManager from "../src/manager/NodeDatafileManager";
import * as nodeRequest from "../src/nodeRequest";
import { Headers, AbortableRequest } from "../src/@types/http";
import { advanceTimersByTime, getTimerCount } from "./testUtils";

describe("nodeDatafileManager", () => {
    let makeGetRequestSpy: jest.SpyInstance<AbortableRequest, [string, Headers]>;
    beforeEach(() => {
        jest.useFakeTimers();
        makeGetRequestSpy = jest.spyOn(nodeRequest, "makeGetRequest");
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllTimers();
    });

    it("calls nodeEnvironment.makeGetRequest when started", async () => {
        makeGetRequestSpy.mockReturnValue({
            abort: jest.fn(),
            responsePromise: Promise.resolve({
                statusCode: 200,
                body: '{"foo":"bar"}',
                headers: {},
            }),
        });

        const manager = new NodeDatafileManager({
            sdkKey: "1234",
            autoUpdate: false,
        });
        manager.start();
        expect(makeGetRequestSpy).toBeCalledTimes(1);
        expect(makeGetRequestSpy.mock.calls[0][0]).toBe("http://localhost:5000/datafiles/1234.json");
        expect(makeGetRequestSpy.mock.calls[0][1]).toEqual({});

        await manager.onReady();
        await manager.stop();
    });

    it("calls nodeEnvironment.makeGetRequest for live update requests", async () => {
        makeGetRequestSpy.mockReturnValue({
            abort: jest.fn(),
            responsePromise: Promise.resolve({
                statusCode: 200,
                body: '{"foo":"bar"}',
                headers: {
                    "last-modified": "Fri, 08 Mar 2019 18:57:17 GMT",
                },
            }),
        });
        const manager = new NodeDatafileManager({
            sdkKey: "1234",
            autoUpdate: true,
        });
        manager.start();
        await manager.onReady();
        await advanceTimersByTime(300000);
        expect(makeGetRequestSpy).toBeCalledTimes(2);
        expect(makeGetRequestSpy.mock.calls[1][0]).toBe("http://localhost:5000/datafiles/1234.json");
        expect(makeGetRequestSpy.mock.calls[1][1]).toEqual({
            "if-modified-since": "Fri, 08 Mar 2019 18:57:17 GMT",
        });

        await manager.stop();
    });

    it("defaults to true for autoUpdate", async () => {
        makeGetRequestSpy.mockReturnValue({
            abort: jest.fn(),
            responsePromise: Promise.resolve({
                statusCode: 200,
                body: '{"foo":"bar"}',
                headers: {
                    "last-modified": "Fri, 08 Mar 2019 18:57:17 GMT",
                },
            }),
        });
        const manager = new NodeDatafileManager({
            sdkKey: "1234",
        });
        manager.start();
        await manager.onReady();
        // Should set a timeout for a later update
        expect(getTimerCount()).toBe(1);
        await advanceTimersByTime(300000);
        expect(makeGetRequestSpy).toBeCalledTimes(2);

        await manager.stop();
    });

    it("uses authenticated default datafile url when auth token is provided", async () => {
        makeGetRequestSpy.mockReturnValue({
            abort: jest.fn(),
            responsePromise: Promise.resolve({
                statusCode: 200,
                body: '{"foo":"bar"}',
                headers: {},
            }),
        });
        const manager = new NodeDatafileManager({
            sdkKey: "1234",
            datafileAccessToken: "abcdefgh",
        });
        manager.start();
        expect(makeGetRequestSpy).toBeCalledTimes(1);
        expect(makeGetRequestSpy).toBeCalledWith(
            "https://config.luminoso.com/datafiles/auth/1234.json",
            expect.anything()
        );
        await manager.stop();
    });

    it("uses public default datafile url when auth token is not provided", async () => {
        makeGetRequestSpy.mockReturnValue({
            abort: jest.fn(),
            responsePromise: Promise.resolve({
                statusCode: 200,
                body: '{"foo":"bar"}',
                headers: {},
            }),
        });
        const manager = new NodeDatafileManager({
            sdkKey: "1234",
        });
        manager.start();
        expect(makeGetRequestSpy).toBeCalledTimes(1);
        expect(makeGetRequestSpy).toBeCalledWith("http://localhost:5000/datafiles/1234.json", expect.anything());
        await manager.stop();
    });

    it("adds authorization header with bearer token when auth token is provided", async () => {
        makeGetRequestSpy.mockReturnValue({
            abort: jest.fn(),
            responsePromise: Promise.resolve({
                statusCode: 200,
                body: '{"foo":"bar"}',
                headers: {},
            }),
        });
        const manager = new NodeDatafileManager({
            sdkKey: "1234",
            datafileAccessToken: "abcdefgh",
        });
        manager.start();
        expect(makeGetRequestSpy).toBeCalledTimes(1);
        expect(makeGetRequestSpy).toBeCalledWith(expect.anything(), { Authorization: "Bearer abcdefgh" });
        await manager.stop();
    });

    it("prefers user provided url template over defaults", async () => {
        makeGetRequestSpy.mockReturnValue({
            abort: jest.fn(),
            responsePromise: Promise.resolve({
                statusCode: 200,
                body: '{"foo":"bar"}',
                headers: {},
            }),
        });
        const manager = new NodeDatafileManager({
            sdkKey: "1234",
            datafileAccessToken: "abcdefgh",
            urlTemplate: "https://myawesomeurl/",
        });
        manager.start();
        expect(makeGetRequestSpy).toBeCalledTimes(1);
        expect(makeGetRequestSpy).toBeCalledWith("https://myawesomeurl/", expect.anything());
        await manager.stop();
    });
});
