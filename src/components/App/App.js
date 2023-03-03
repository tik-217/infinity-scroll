import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

/** components */
import useGetUsers from "../../hooks/useGetUsers";

/** antd - UI */
import { Avatar, Card } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import "./App.css";

const { Meta } = Card;

/**
 * @description The main component of the output of user cards
 * @component App
 */
export default function App() {
  /**
   * Download status
   * @constant {boolean} */
  const [loading, setLoading] = useState(true);

  /**
   * List of users
   * @typedef { import("../types").IUsersResults} IUsersResults
   * @type {IUsersResults[]}
   * */
  const [allUsers, setAllUsers] = useState([]);

  /**
   * Page number of the current card page with users
   * @constant {number}
   * */
  const [page, setPage] = useState(1);

  /**
   * Server response with users
   * @typedef { import("../types").IUsersResults} IUsersResults
   * */
  const { users } = useGetUsers(page);

  const observable = useRef();

  /**
   * @description The function finds the last card in the viewport of the user window
   * */
  const triggerLoad = useCallback(
    /** @param { HTMLDivElement } node HTML tag of the element on which this function is triggered */
    (node) => {
      if (loading) return;
      if (observable.current) observable.current.disconnect();

      /** Assign a new page if the list is scrolled to the end */
      observable.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((page) => page + 1);
        }
      });

      if (node) observable.current.observe(node);
    },
    // eslint-disable-next-line
    [loading]
  );

  useEffect(() => {
    /** The user's upload status. Hide the download if the cards have loaded */
    if (users.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    if (users.length === 0) return;

    /** Forming an array of cards with users. The previous cards and those received from the server are used */
    setAllUsers((allUsers) => [...allUsers, ...users]);
  }, [users]);

  return (
    <div>
      {loading && (
        <div className="cards__spiner">
          <LoadingOutlined
            style={{
              fontSize: 24,
            }}
            spin
          />
        </div>
      )}
      <div className="cards">
        {allUsers.map((el, i) => {
          return (
            <Card
              style={{
                width: 300,
              }}
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
              key={i}
            >
              {(i + 1) % 10 === 0 && <div ref={triggerLoad}></div>}
              <Meta
                avatar={<Avatar src={el.picture.thumbnail} />}
                title={`${el.name.first} ${el.name.last}`}
                description={el.email}
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
