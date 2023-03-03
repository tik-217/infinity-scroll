import React, { useEffect, useState } from "react";

/**
 * @typedef { import("../types").IUsersApi} IUsersApi
 * @typedef { import("../types").IUsersResults} IUsersResults
 *
 * @description A hook for getting user cards
 * @param {number} page
 * @returns {{IUsersResults}}
 * */
export default function useGetUsers(page) {
  /**
   * Array of users
   * @type {IUsersResults[][]}
   * */
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function usersList() {
      /**
       * @description Request to receive users
       * @type {IUsersApi}
       * */
      const response = await fetch(
        `https://randomuser.me/api/?page=${page}&inc=name,email,picture&results=20&seed=abc`
      )
        .then((res) => res.json())
        .then(
          /** @param {IUsersApi} data */
          (data) => data
        )
        .catch((err) => console.log(err));

      setUsers(response.results);
    }

    usersList();
  }, [page]);

  return {
    users,
  };
}
