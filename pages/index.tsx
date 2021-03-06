import { GetServerSidePropsContext, NextPage } from "next";
import React from "react";
import styles from "../styles/Home.module.css";
import Header from "../components/minor/flesh/Header/Header";
import HeaderSkeleton from "../components/minor/skeletons/components/Header/HeaderSkeleton";

import { useRouter } from "next/router";
import { client } from "../providers/UrqlProvider";
import Modal from "../components/common/Modal/Modal";
import { CookieDocument, useUserQuery } from "../src/generated/graphql";
import SideBarHeader from "../components/SideBarHeader/SideBarHeader";
import DriveItem from "../components/DriveItem/DriveItem";
import MainHeader from "../components/MainHeader/MainHeader";
import Folder from "../components/Folder/Folder";
import Files from "../components/Files/Files";
import ProfilePictureCard from "../components/minor/flesh/ProfilePictureCard/ProfilePictureCard";
import StorageCard from "../components/StorageCard/StorageCard";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userCookie: string = context.req.cookies?.uid;
  const { data } = await client
    .query(CookieDocument, {
      cookie: userCookie ? userCookie : "",
    })
    .toPromise();
  if (data?.cookie === false) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }
  return {
    props: {},
  };
}

const folders = [
  "Documents",
  "Pictures",
  "Music",
  "Videos",
  "Miscellaneous",
  "Trash",
];
const Home: NextPage<{}> = () => {
  const router = useRouter();
  const [folder, setFolder] = React.useState<string>("");
  const theme = "light"; //useSelector((state: any) => state.theme);
  const className: string = `${styles.app} ${styles.light__theme}`;
  const { query } = router;
  const [{ data, fetching }, _] = useUserQuery();
  const [open, setOpen] = React.useState(false);

  return (
    <div className={className}>
      {fetching ? <HeaderSkeleton theme={theme} /> : <Header theme={theme} />}

      {(query as any)?.next === "profile" && (
        <Modal>
          <ProfilePictureCard />
        </Modal>
      )}
      <div className={styles.app__main}>
        <div className={styles.app__main__sidebar}>
          <div className={styles.app__main__sidebar__header}>
            <SideBarHeader setFolder={setFolder} />
          </div>
          <div className={styles.app__main__sidebar__items}>
            {folders.map((title, index) => (
              <DriveItem
                active={folder === title}
                key={index.toString()}
                title={title}
                setFolder={setFolder}
              />
            ))}
          </div>
          <div className={styles.app__main__sidebar__footer}>
            <StorageCard />
          </div>
        </div>
        <div className={styles.app__main__main}>
          <div className={styles.app__main__main__header}>
            <MainHeader folder={folder} setFolder={setFolder} />
          </div>
          <div className={styles.app__main__main__items}>
            {!folder ? (
              folders.map((folder) => (
                <Folder key={folder} title={folder} setFolder={setFolder} />
              ))
            ) : (
              <Files folder={folder} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
