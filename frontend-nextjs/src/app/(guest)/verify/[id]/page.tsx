import Verify from "@/components/auth/verify";

interface IProps {
    params: Promise<{ id: string }>;
}

const VerifyPage = async({ params }: IProps) => {
    const { id } = await params; 
    return (
        <>
            <Verify id={id}/>
        </>
    );
};

export default VerifyPage;