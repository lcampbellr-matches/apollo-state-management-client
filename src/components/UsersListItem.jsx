import clsx from "clsx"

export const UserListItem = ({title,favouriteBookTitle,favouriteMovieTitle, approval}) =>  <div key={title}>{title} likes the book "{favouriteBookTitle}" and the movie "{favouriteMovieTitle}"<div className={clsx({ approved:approval, unapproved:!approval, })}></div></div>
