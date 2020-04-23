type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

type AuthenticationInput = {
  login: Scalars['String'];
  password: Scalars['String'];
};


enum Gender {
  M = 'M',
  F = 'F',
  N = 'N'
}

type Mutation = {
   __typename?: 'Mutation';
  login: User;
  register: User;
};


type MutationLoginArgs = {
  input: AuthenticationInput;
};


type MutationRegisterArgs = {
  input: UserInsertInput;
};

type Person = {
   __typename?: 'Person';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt: Scalars['DateTime'];
  name: Scalars['String'];
  email: Scalars['String'];
  gender: Gender;
};

type PersonInput = {
  name: Scalars['String'];
  email: Scalars['String'];
  gender: Gender;
};

type Query = {
   __typename?: 'Query';
  findUser: User;
  logged: Scalars['Boolean'];
  profile: User;
  showUsers: Array<User>;
};


type QueryFindUserArgs = {
  id: Scalars['ID'];
};


type QueryShowUsersArgs = {
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};

type User = {
   __typename?: 'User';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt: Scalars['DateTime'];
  login: Scalars['String'];
  password: Scalars['String'];
  personID: Scalars['String'];
  person: Person;
};

type UserInsertInput = {
  login: Scalars['String'];
  password: Scalars['String'];
  person: PersonInput;
};

type UserValuesFragment = { __typename?: 'User', id: string, login: string, person: { __typename?: 'Person', id: string, name: string, email: string } };

type LoginMutationVariables = {
  input: AuthenticationInput;
};


type LoginMutation = { __typename?: 'Mutation', login: (
    { __typename?: 'User' }
    & UserValuesFragment
  ) };

type LoggedQueryVariables = {};


type LoggedQuery = { __typename?: 'Query', logged: boolean };

type UserValuesFragment = { __typename?: 'User', id: string, login: string, person: { __typename?: 'Person', id: string, name: string, email: string } };

type ShowAllUsersQueryVariables = {};


type ShowAllUsersQuery = { __typename?: 'Query', showUsers: Array<(
    { __typename?: 'User' }
    & UserValuesFragment
  )> };
