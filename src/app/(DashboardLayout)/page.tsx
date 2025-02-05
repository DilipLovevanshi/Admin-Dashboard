"use client";
import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import { Table } from "flowbite-react";

import AddEditUser from "../components/AddEditUser";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_API } from "@/constants/api";

const Page = () => {
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [productTableData, setProductTableData] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [actionType, setActionType] = useState("ADD");

  const handleDeleteCall = async (id: any) => {
    try {
      const response = await fetch(
        `${BACKEND_API}api/users?userId=${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast("User Deleted Successfully");
        fetchUsers();
      }
    } catch (error) {
      console.log(error, "error while fetching users");
    }
  };

  const handleEditCall = (data: any) => {
    setActionType("EDIT");
    setUserModalVisible(true);
    setUserDetails(data);
    console.log(data, "user Details");
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BACKEND_API}api/users`);
      const data = await response.json();
      console.log(data, "data");
      setProductTableData(data);
    } catch (error) {
      console.log(error, "error while fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <ToastContainer />
      {userModalVisible && (
        <AddEditUser
          visible={userModalVisible}
          setVisible={setUserModalVisible}
          fetchData={fetchUsers}
          userDetails={userDetails}
          actionType={actionType}
        />
      )}
      <div className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
        <div className=" flex items-center justify-between">
          <h5 className="card-title">Table</h5>
          <Button
            color={"primary"}
            onClick={() => {
              setUserDetails({});
              setUserModalVisible(true);
              setActionType("ADD");
            }}
            className="w-fit "
          >
            Add Inspector{" "}
          </Button>
        </div>
        <div className="mt-3">
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="p-6">Sr.no</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Phone</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-border dark:divide-darkborder ">
                {productTableData.map((item: any, index) => (
                  <Table.Row key={index}>
                    <Table.Cell className="whitespace-nowrap ps-6">
                      <h6 className="text-sm">{index + 1}</h6>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-base text-wrap">
                        {item?.firstName} {item?.lastName}
                      </h5>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-base text-wrap">{item?.phone}</h5>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-base text-wrap">{item?.email}</h5>
                    </Table.Cell>
                    <Table.Cell>
                      <Dropdown
                        label=""
                        dismissOnClick={false}
                        renderTrigger={() => (
                          <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                            <HiOutlineDotsVertical size={22} />
                          </span>
                        )}
                      >
                        <Dropdown.Item
                          key={index}
                          className="flex gap-3"
                          onClick={() => handleEditCall(item)}
                        >
                          {" "}
                          <Icon
                            icon={`solar:pen-new-square-broken`}
                            height={18}
                          />
                          <span>Edit</span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          key={index}
                          className="flex gap-3"
                          onClick={() => handleDeleteCall(item._id)}
                        >
                          {" "}
                          <Icon
                            icon={`solar:trash-bin-minimalistic-outline`}
                            height={18}
                          />
                          <span>Delete</span>
                        </Dropdown.Item>
                      </Dropdown>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
