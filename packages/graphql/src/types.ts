import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type CacheControlScope = 'PUBLIC' | 'PRIVATE';

export type CreateHistoryItemInput = {
  rawPm25: Scalars['Float'];
  universalId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type CreateUserInput = {
  expoInstallationId: Scalars['String'];
  expoPushToken?: Maybe<Scalars['String']>;
  notifications?: Maybe<NotificationsInput>;
};

export type Frequency = 'never' | 'daily' | 'weekly' | 'monthly';

export type HistoryItem = {
  __typename?: 'HistoryItem';
  _id: Scalars['ID'];
  createdAt: Scalars['Date'];
  rawPm25: Scalars['Float'];
  stationId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _?: Maybe<Scalars['Boolean']>;
  createHistoryItem: Scalars['Boolean'];
  createUser: User;
  updateUser: User;
};

export type MutationCreateHistoryItemArgs = {
  input: CreateHistoryItemInput;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationUpdateUserArgs = {
  userId: Scalars['ID'];
  input: UpdateUserInput;
};

export type Notifications = {
  __typename?: 'Notifications';
  frequency: Frequency;
};

export type NotificationsInput = {
  frequency: Frequency;
};

export type Provider = 'waqi';

export type Query = {
  __typename?: 'Query';
  _?: Maybe<Scalars['Boolean']>;
};

export type Station = {
  __typename?: 'Station';
  _id: Scalars['ID'];
  name: Scalars['String'];
  provider: Provider;
  universalId: Scalars['ID'];
};

export type UpdateUserInput = {
  expoInstallationId?: Maybe<Scalars['String']>;
  expoPushToken?: Maybe<Scalars['String']>;
  notifications?: Maybe<NotificationsInput>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  expoInstallationId: Scalars['String'];
  expoPushToken?: Maybe<Scalars['String']>;
  history: Array<Maybe<HistoryItem>>;
  notifications: Notifications;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Mutation: ResolverTypeWrapper<{}>;
  CreateHistoryItemInput: CreateHistoryItemInput;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  CreateUserInput: CreateUserInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  NotificationsInput: NotificationsInput;
  Frequency: Frequency;
  User: ResolverTypeWrapper<User>;
  HistoryItem: ResolverTypeWrapper<HistoryItem>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Notifications: ResolverTypeWrapper<Notifications>;
  UpdateUserInput: UpdateUserInput;
  CacheControlScope: CacheControlScope;
  Provider: Provider;
  Station: ResolverTypeWrapper<Station>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Boolean: Scalars['Boolean'];
  Mutation: {};
  CreateHistoryItemInput: CreateHistoryItemInput;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  CreateUserInput: CreateUserInput;
  String: Scalars['String'];
  NotificationsInput: NotificationsInput;
  Frequency: Frequency;
  User: User;
  HistoryItem: HistoryItem;
  Date: Scalars['Date'];
  Notifications: Notifications;
  UpdateUserInput: UpdateUserInput;
  CacheControlScope: CacheControlScope;
  Provider: Provider;
  Station: Station;
  Upload: Scalars['Upload'];
  Int: Scalars['Int'];
}>;

export type CacheControlDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = {
    maxAge?: Maybe<Maybe<Scalars['Int']>>;
    scope?: Maybe<Maybe<CacheControlScope>>;
  }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type HistoryItemResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['HistoryItem'] = ResolversParentTypes['HistoryItem']
> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  rawPm25?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  stationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  createHistoryItem?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateHistoryItemArgs, 'input'>
  >;
  createUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, 'input'>
  >;
  updateUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, 'userId' | 'input'>
  >;
}>;

export type NotificationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Notifications'] = ResolversParentTypes['Notifications']
> = ResolversObject<{
  frequency?: Resolver<ResolversTypes['Frequency'], ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
}>;

export type StationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Station'] = ResolversParentTypes['Station']
> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['Provider'], ParentType, ContextType>;
  universalId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  expoInstallationId?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  expoPushToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  history?: Resolver<
    Array<Maybe<ResolversTypes['HistoryItem']>>,
    ParentType,
    ContextType
  >;
  notifications?: Resolver<
    ResolversTypes['Notifications'],
    ParentType,
    ContextType
  >;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Date?: GraphQLScalarType;
  HistoryItem?: HistoryItemResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Notifications?: NotificationsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Station?: StationResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
}>;

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<
  ContextType
>;
