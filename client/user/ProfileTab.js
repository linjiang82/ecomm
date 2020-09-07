import { AppBar, Tabs, Tab } from "@material-ui/core";
import React, { useState } from "react";
import FollowGrid from "./FollowGrid";
import PostList from "../post/PostList";

const ProfileTab = (props) => {
  const [tab, setTab] = useState(0);
  const handleChange = (e, value) => {
    setTab(value);
  };
  return (
    <div>
      <AppBar position='static'>
        <Tabs value={tab} onChange={handleChange}>
          <Tab label='Posts' />
          <Tab label='Following' />
          <Tab label='Followers' />
        </Tabs>
      </AppBar>
      {tab === 0 && <PostList posts={props.posts}></PostList>}
      {tab === 1 && <FollowGrid people={props.people.following}></FollowGrid>}
      {tab === 2 && <FollowGrid people={props.people.followers}></FollowGrid>}
    </div>
  );
};

export default ProfileTab;
