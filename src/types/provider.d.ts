interface IProvider {
    name: string;
    id: string;
    readOnly: boolean;
    library?: string;
    algorithms: string[];
}

interface IModule {
    name: string;
    providers: IProvider[];
}