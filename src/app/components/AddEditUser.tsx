import {
  Button,
  Datepicker,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";

interface AddEditUserProps {
  visible: boolean;
  setVisible: any;
  fetchData: any;
  userDetails: any;
  actionType: any;
}
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddEditUser: React.FC<AddEditUserProps> = ({
  visible,
  setVisible,
  fetchData,
  userDetails,
  actionType,
}) => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    license: {
      licenseType: "",
      licenseNo: "",
      expiryDate: "",
    },
  });

  const handleUserDataChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUserSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setUserData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          license: {
            licenseType: "",
            licenseNo: "",
            expiryDate: "",
          },
        });
        setVisible(false);
        toast("User Added Successfully");
        fetchData();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleEditUserSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "PATCH",
        body: JSON.stringify({
          userId: userDetails._id,
          firstName: userData.firstName,
        }),
      });

      if (response.ok) {
        setUserData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          license: {
            licenseType: "",
            licenseNo: "",
            expiryDate: "",
          },
        });
        setVisible(false);
        toast("User Updated Successfully");
        fetchData();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    if (actionType == "EDIT" && userDetails) {
      setUserData({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        phone: userDetails.phone,
        license: {
          licenseType: userDetails.license.licenseType,
          licenseNo: userDetails.license.licenseNo,
          expiryDate: "",
        },
      });
    }
  }, []);

  return (
    <>
      <Modal show={visible} onClose={() => setVisible(false)}>
        <Modal.Header>{actionType == "ADD" ? "Add New Inspector" : "Edit Inspector"} User</Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="grid grid-cols-12 gap-30">
              <div className="lg:col-span-6 col-span-12">
                <div className="flex  flex-col gap-4">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="name" value="Your First Name" />
                    </div>
                    <TextInput
                      id="name"
                      type="text"
                      placeholder="Enter Fist Name"
                      required
                      className="form-control"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleUserDataChange}
                    />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 col-span-12">
                <div className="flex  flex-col gap-4">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="name" value="Your Last Name" />
                    </div>
                    <TextInput
                      id="name"
                      type="text"
                      placeholder="Enter Last name"
                      required
                      className="form-control"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleUserDataChange}
                    />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-12 col-span-12">
                <div className="flex  flex-col gap-4">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="email1" value="Your email" />
                    </div>
                    <TextInput
                      id="email1"
                      type="email"
                      placeholder="email@example.com"
                      required
                      disabled={actionType == "EDIT"}
                      className="form-control"
                      name="email"
                      value={userData.email}
                      onChange={handleUserDataChange}
                    />
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="name" value="Your Phone" />
                    </div>
                    <TextInput
                      id="name"
                      type="number"
                      placeholder="Enter Phone No"
                      required
                      className="form-control"
                      name="phone"
                      value={userData.phone}
                      onChange={handleUserDataChange}
                    />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-12 col-span-12 flex justify-between "><Label htmlFor="License Type" value="Licenses" /> <Label htmlFor="License Type" value="+ Add License" className="text-blue-500 cursor-pointer" /> </div>
                      
              <div className="lg:col-span-12 col-span-12 bg-gray-50 p-4 border rounded-md">
                <div className="flex  flex-col gap-4">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="License Type" value="License Type" />
                    </div>
                    <Select id="countries" required className="select-rounded">
                      <option>Commercial</option>
                      <option>Residential</option>
                    </Select>
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="License No" value="Your Phone" />
                    </div>
                    <TextInput
                      id="name"
                      type="text"
                      placeholder="Enter Phone No"
                      required
                      className="form-control"
                      name="phone"
                      value={userData.license.licenseNo}
                      onChange={handleUserDataChange}
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label
                        htmlFor="License Expiry Date"
                        value="Expiry Date"
                      />
                    </div>
                    {/* <TextInput
                      id="name"
                      type="date"
                      placeholder="Enter Date"
                      required
                      className="form-control"
                      name="expiryDate"
                      value={userData.license.expiryDate}
                      onChange={handleUserDataChange}
                    /> */}
                    <Datepicker
                      name="expiryDate"
                      className=""
                      value={userData.license.expiryDate}
                      onChange={handleUserDataChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <Button
              color={"primary"}
              onClick={
                actionType == "ADD" ? handleAddUserSubmit : handleEditUserSubmit
              }
            >
              Submit
            </Button>
            <Button color={"error"} onClick={() => setVisible(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEditUser;
