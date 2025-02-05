import { BACKEND_API } from "@/constants/api";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface AddEditUserProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  fetchData: () => void;
  userDetails: any;
  actionType: string;
}

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
    license: [
      {
        licenseType: "",
        licenseNo: "",
        expiryDate: "",
      },
    ],
  });

  useEffect(() => {
    if (actionType === "EDIT" && userDetails) {
      setUserData({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        phone: userDetails.phone,
        license: userDetails.license?.length
          ? userDetails.license.map((license: any) => ({
              ...license,
              expiryDate: license.expiryDate
                ? new Date(license.expiryDate).toISOString().split("T")[0]
                : "",
            }))
          : [{ licenseType: "", licenseNo: "", expiryDate: "" }],
      });
    }
  }, [actionType, userDetails]);

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLicenseChange = (index: number, field: string, value: string) => {
    setUserData((prev) => ({
      ...prev,
      license: prev.license.map((license, i) =>
        i === index ? { ...license, [field]: value } : license
      ),
    }));
  };

  const addLicense = () => {
    setUserData((prev) => ({
      ...prev,
      license: [
        ...prev.license,
        { licenseType: "", licenseNo: "", expiryDate: "" },
      ],
    }));
  };

  const removeLicense = (index: number) => {
    setUserData((prev) => ({
      ...prev,
      license: prev.license.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      const formattedLicenses = userData.license.map((license) => ({
        ...license,
        expiryDate: license.expiryDate
          ? new Date(license.expiryDate).toISOString()
          : null,
      }));

      const response = await fetch(`${BACKEND_API}api/users`, {
        method: actionType === "ADD" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
          license: formattedLicenses,
          userId: actionType === "EDIT" ? userDetails._id : undefined,
        }),
      });

      console.log(
        userData,
        "userData userData",
        formattedLicenses,
        "formattedLicenses"
      );

      if (response.ok) {
        setUserData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          license: [{ licenseType: "", licenseNo: "", expiryDate: "" }],
        });
        setVisible(false);
        toast(
          actionType === "ADD"
            ? "User Added Successfully"
            : "User Updated Successfully"
        );
        fetchData();
      } else {
        throw new Error("Failed to save user data");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while saving the user data.");
    }
  };

  return (
    <Modal show={visible} onClose={() => setVisible(false)}>
      <Modal.Header>
        {actionType === "ADD" ? "Add New Inspector" : "Edit Inspector"}
      </Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Label value="First Name" />
            <TextInput
              name="firstName"
              value={userData.firstName}
              onChange={handleUserDataChange}
              placeholder="Enter First Name"
              required
            />
          </div>
          <div className="col-span-6">
            <Label value="Last Name" />
            <TextInput
              name="lastName"
              value={userData.lastName}
              onChange={handleUserDataChange}
              placeholder="Enter Last Name"
              required
            />
          </div>
          <div className="col-span-12">
            <Label value="Email" />
            <TextInput
              name="email"
              value={userData.email}
              onChange={handleUserDataChange}
              placeholder="email@example.com"
              required
              disabled={actionType === "EDIT"}
            />
          </div>
          <div className="col-span-12">
            <Label value="Phone" />
            <TextInput
              name="phone"
              value={userData.phone}
              onChange={handleUserDataChange}
              placeholder="Enter Phone Number"
              required
            />
          </div>

          <div className="col-span-12 flex justify-between">
            <Label value="Licenses" />
            <button
              type="button"
              className="text-blue-500"
              onClick={addLicense}
            >
              + Add License
            </button>
          </div>

          {userData.license.map((license, index) => (
            <div
              key={index}
              className="col-span-12 bg-gray-50 p-4 border rounded-md relative "
            >
              <h3 className="mb-2">{`License ${index + 1}`}</h3>
              <div className="my-4">
                <Label value={`License`} />
                <Select
                  value={license.licenseType}
                  onChange={(e) =>
                    handleLicenseChange(index, "licenseType", e.target.value)
                  }
                >
                  <option value="">Select License Type</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                </Select>
              </div>
              <div className="my-4">
                <Label value={`License No`} />
                <TextInput
                  name="licenseNo"
                  value={license.licenseNo}
                  onChange={(e) =>
                    handleLicenseChange(index, "licenseNo", e.target.value)
                  }
                  placeholder="License Number"
                  required
                />
              </div>
              <div className="my-4">
                <Label value={`Expiration Date`} />

                <TextInput
                  type="date"
                  name="expiryDate"
                  value={license.expiryDate}
                  onChange={(e) =>
                    handleLicenseChange(index, "expiryDate", e.target.value)
                  }
                  required
                />
              </div>
              {userData.license.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 absolute top-2 right-2"
                  onClick={() => removeLicense(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="primary" onClick={handleSubmit}>
          Submit
        </Button>
        <Button color="error" onClick={() => setVisible(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditUser;
