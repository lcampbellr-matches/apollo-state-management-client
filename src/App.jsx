import logo from './logo.svg';
import './App.css';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import {
  useQuery,
  useMutation,
} from "@apollo/client";
import React, { useContext } from 'react';
import { GET_BOOKS, GET_MOVIES, GET_USERS, UPDATE_USERS, updateUsersOptions, getUsersOptions } from "./queries_mutations";
import { AppContext } from '.';
import { AutoCompleteComp } from './components/Autocomplete';
import { UserListItem } from './components/UsersListItem';

const pollUntilAllApproved = (users = [], start, stop) => {
  start(1000);
  if (users.every(user => user.approval)) stop();
};

const App = () => {
  const { loading: loadingBooks, error: errorBooks, data: booksData } = useQuery(GET_BOOKS);
  const { loading: loadingMovies, error: errorMovies, data: moviesData } = useQuery(GET_MOVIES);
  const { loading: loadingUsers, error: errorUsers, data: usersData, startPolling, stopPolling } = useQuery(GET_USERS, getUsersOptions);
  const [updateUsers] = useMutation(UPDATE_USERS, updateUsersOptions);
  const localState = useContext(AppContext);

  pollUntilAllApproved(usersData?.users, startPolling, stopPolling);


  if (loadingBooks || loadingMovies || loadingUsers) return <p>Loading...</p>;
  if (errorBooks || errorMovies || errorUsers) return <p>Error :(</p>;

  const books = booksData?.books?? [];
  const users = usersData?.users?? [];
  const movies = moviesData?.movies?? [];

  const submitOnClick = () => {

    const user = localState.user();
    const book = localState.book();
    const movie = localState.movie();

    const submitDetails = {
      title: user.title,
      movie: movie.title,
      book: book.title,
    };
      
    updateUsers({
      variables: {
        input: submitDetails
      }
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          { 
            users.map(({title, favouriteBook, favouriteMovie, approval}) => {
              return <UserListItem key={title} title={title} favouriteBookTitle={favouriteBook.title} favouriteMovieTitle={favouriteMovie.title} approval={approval}  />
            })
          }
          <h2>Users</h2>
          <AutoCompleteComp stateName="user" options={users} />
          <h2>Set Book</h2>
          <AutoCompleteComp stateName="book" options={books} />
          <h2>Set Movie</h2>
          <AutoCompleteComp stateName="movie" options={movies} />
          <Button
            variant="contained" color="primary"
            onClick={submitOnClick}
            >
            Submit choice
          </Button>

      </header>
    </div>
  );
}

export default App;
