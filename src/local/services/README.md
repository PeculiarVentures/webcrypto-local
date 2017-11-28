# Services

## Service

Abstract class which allows to wrap class and translate it's methods to REST API using 2key ratchet server and ProtoBuffer message.

### Error and Info events

Each wrapped class must extends EventEmitter and supports two events. Service adds `error` and `info` listeners for wrapped object. It allows to emit own `error` and `info` events

```ts
public on(event: "error", (error: Error) => void): this;
public on(event: "info", (message: string) => void): this;
```

### REST API implementation

```ts
export class CryptoService extends Service<Crypto> {

    constructor(server: Server, crypto: Crypto) {
        super(server, crypto, [
            CP.IsLoggedInActionProto,
            CP.LoginActionProto,
            CP.LogoutActionProto,
            CP.ResetActionProto,
        ]);
    }

    protected async onMessage(session: Session, action: ActionProto) {
        const result = new ResultProto(action);
        switch (action.action) {
            case CP.IsLoggedInActionProto.ACTION: {
                // ...
                break;
            }
            case CP.LoginActionProto.ACTION: {
                // ...
                break;
            }
            case CP.LogoutActionProto.ACTION: {
                // ...
                break;
            }
            case CP.ResetActionProto.ACTION: {
                // ...
                break;
            }
            default:
                throw new Error(`Action '${action.action}' is not implemented`);
        }
        return result;
    }

}
```