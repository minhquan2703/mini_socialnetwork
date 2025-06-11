export enum MediaType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface IGetAllPosts {
    current: number;
    pageSize: number;
}

export interface ICreatePost{
    content: string;
    mediaType: MediaType
    mediaURL: string;
}
