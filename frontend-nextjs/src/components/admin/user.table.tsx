'use client'
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Popconfirm, Table } from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";
import UserCreate from "./user.create";
import { handleDeleteUserAction } from "@/utils/action";
import UserUpdate from "./user.update";
import { IGetAllUsersPagination } from "@/app/(admin)/dashboard/user/page";



const UserTable = (props: IGetAllUsersPagination) => {
    const { users, meta } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<unknown>(null);

    const columns = [
        {
            title: "STT",
            render: (_: unknown, record: unknown, index: unknown) => {
                return (
                    <>{(index + 1) + (meta.current - 1) * (meta.pageSize)}</>
                )
            }
        },
        {
            title: 'id',
            dataIndex: 'id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Actions',

            render: (text: unknown, record: unknown) => {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800" style={{ cursor: "pointer", margin: "0 20px" }}
                            onClick={() => {
                                setIsUpdateModalOpen(true);
                                setDataUpdate(record);
                            }}
                        />

                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa user này ?"}
                            onConfirm={async () => await handleDeleteUserAction(record?.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>
                    </>
                )
            }
        }

    ];

    const onChange = (pagination: unknown /*, filters: unknown, sorter: unknown, extra: unknown*/) => {
        if (pagination && pagination?.current) {
            const params = new URLSearchParams(searchParams);
            params.set('current', pagination.current);
            replace(`${pathname}?${params.toString()}`);
        }
    };


    return (
        <>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Manager Users</span>
                <Button onClick={() => setIsCreateModalOpen(true)}>Create User</Button>
            </div>
            <Table
                bordered
                dataSource={users}
                columns={columns}
                rowKey={"id"}
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }
                onChange={onChange}
            />

            <UserCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
            />

            <UserUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}

export default UserTable;
