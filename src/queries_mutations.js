import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
query GetBooks {
  books {
    title
    author
  }
}
`;

export const GET_MOVIES = gql`
query GetMovies {
  movies {
    year
    title
  }
}
`;

export const UPDATE_USERS = gql`
mutation  UpdateUsers ($input: UpdateInput) {
  updateUsers(input:$input) {
    title
    favouriteBook {
      title
      author
    }
    favouriteMovie {
      title
      year
    }
  }
}
`;

export const UpdateUsersOptions = {
  update(cache, { data }){
    const existingsUsers = cache.readQuery({
      query: GET_USERS,
    });
    const updatedUser = data.updateUsers;
    let index = existingsUsers.users.findIndex(({ title }) => title === updatedUser.title);
    if (index < 0) index = existingsUsers.users.length;
    
    const updateObj = {
      __typename: "User",
      title: updatedUser.title,
      favouriteBook: {
        title: updatedUser.favouriteBook.title,
      },
      favouriteMovie: {
        title: updatedUser.favouriteMovie.title,
      },
      approval: false,
    };

    const writeUsers = [...existingsUsers.users];
    writeUsers.splice(index, 1, updateObj)

    cache.writeQuery({
      query: GET_USERS,
      data: {
        users: writeUsers,
      }
    });
  },
};

export const GET_USERS = gql`
query GetUsers {
  users {
    title
    favouriteBook {
      title
    }
    favouriteMovie {
      title
    }
    approval
  }
}
`;