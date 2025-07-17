import { auth } from "@/auth";
import UserTable from "@/components/admin/user.table";
import { IUserPagination } from "@/types/next-auth";
import { sendRequest } from "@/utils/api";

interface IProps {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
}
export interface IGetAllUsersPagination {
    results: IUserPagination[];
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
}
const ManageUserPage = async ({ searchParams }: IProps) => {
    const resolvedSearchParams = await searchParams;
    const current = Number(resolvedSearchParams?.current ?? 1);
    const pageSize = Number(resolvedSearchParams?.pageSize ?? 10);
    const session = await auth();

    const res = await sendRequest<IBackendRes<IGetAllUsersPagination>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "GET",
        queryParams: {
            current,
            pageSize,
        },
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        nextOption: {
            next: { tags: ["list-users"] },
        },
    });

    return (
        <div>
            <UserTable
                users={res?.data?.results ?? []}
                meta={res?.data?.meta}
            />
        </div>
    );
};

export default ManageUserPage;
