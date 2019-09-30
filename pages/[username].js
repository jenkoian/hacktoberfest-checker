import { useRouter } from 'next/router'
import Layout from "../components/layout";
import UsernameForm from "../components/username-form/index";

const User = () => {
    const router = useRouter();
    const { username } = router.query;

    return (
        <Layout>
            <UsernameForm username={username} />
            <PullRequests username={username} />
        </Layout>
    )
};

export default User
