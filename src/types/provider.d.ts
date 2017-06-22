interface IProvider {
    name: string;
    id: string;
    readOnly: boolean;
    library?: string;
    atr?: string;
    algorithms: string[];
    isRemovable: boolean;
}

interface IModule {
    name: string;
    providers: IProvider[];
}