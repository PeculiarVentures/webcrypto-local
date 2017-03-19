interface IProvider {
    name: string;
    id: string;
    algorithms: string[];
}

interface IModule {
    name: string;
    cryptos: IProvider[];
}