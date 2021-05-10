export interface IResourceCoreConfig{
    label: string;
    description: string;
    tags: {};
    onUpdateCallback?( callbackData?: any ): void;
}