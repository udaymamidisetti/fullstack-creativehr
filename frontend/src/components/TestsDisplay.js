import {
  Button,
  Input,
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const TestsDisplay = ({ data }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  console.log(data);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [alternate, setAlternate] = useState("");
  const [test, setTest] = useState([]);
  const [id, setId] = useState();
  const deleteTest = async (testId) => {
    try {
      const response = await fetch(
        `http://localhost:2000/deletetest/${testId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };
  const getDatabyId = async (testId) => {
    onOpen();
    const response = await fetch(
      `http://localhost:2000/getAllValues/${testId}`
    );
    const result = await response.json();
    getTests();
    setName(result[0].Test_name);
    setEmail(result[0].tester_email_id);
    setAlternate(result[0].Alternative_no);
    setType(result[0].Test_type);
    setMobile(result[0].Tester_mobile_no);
    setId(result[0].test_id);
  };
  const getTests = async () => {
    const response = await fetch("http://localhost:2000/gettests");
    const result = await response.json();

    setTest(result);
  };

  const updateTest = async (testId) => {
    try {
      const response = await fetch(
        `http://localhost:2000/updatetest/${testId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Test_name: name,
            Test_type: type,
            tester_email_id: email,
            Tester_mobile_no: mobile,
            Alternative_no: alternate,
          }),
        }
      );

      const data = await response.json();
      if (data.res === 1) {
        toast({
          title: data.message,
          status: "success",
          isClosable: true,
          position: "top-right",
        });
      } else {
        toast({
          title: "Error",
          status: "error",
          isClosable: true,
          position: "top-right",
        });
      }

      setTimeout(() => {
        onClose();
      }, 2000);
      window.location.reload();
    } catch (error) {
      console.error("Error updating test:", error);
    }
  };
  const colorChange = (testType) => {
    switch (testType) {
      case "PHP":
        return "bg-[green]";
      case "Node Js":
        return "bg-[yellow]";
      default:
        return "bg-[orange]";
    }
  };

  return (
    <div className="max-w-[700px] m-auto ">
      <div>
        {data.length === 0 ? (
          <h1>No tests Available</h1>
        ) : (
          <table>
            <tbody>
              <tr className="border h-[50px]">
                <th className="w-[200px]">Test Name</th>
                <th className="w-[200px]">Test Type</th>
                <th className="w-[200px]">Email ID</th>
                <th className="w-[200px]">Mobile No</th>
              </tr>

              {data.map((e, i) => (
                <tr
                  key={i}
                  className={`border ${colorChange(e.Test_type)} h-[50px]`}
                >
                  <td className="border text-center">{e.Test_name}</td>
                  <td className="w-[200px] border text-center">
                    {e.Test_type}
                  </td>
                  <td className="w-[200px] border text-center">
                    {e.tester_email_id}
                  </td>
                  <td className="w-[200px] border text-center ">
                    {e.Tester_mobile_no}
                  </td>
                  <td className="w-[200px] h-[50px] flex gap-[5px] items-center justify-center">
                    <Button
                      size="sm"
                      colorScheme="messenger"
                      onClick={() => getDatabyId(e.test_id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => deleteTest(e.test_id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col gap-[20px] mt-[20px] w-[500px]">
              <h1 className="font-bold text-center">Edit Test details</h1>
              <Input
                placeholder="Enter test name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              />
              <Select
                placeholder="Select test type"
                onChange={(e) => {
                  setType(e.target.value);
                }}
                value={type}
              >
                {test.map((e, i) => (
                  <option value={e.test_type} key={i}>
                    {e.test_type}
                  </option>
                ))}
              </Select>
              <Input
                placeholder="Enter email ID"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
              <Input
                placeholder="Enter mobile number"
                onChange={(e) => {
                  setMobile(e.target.value);
                }}
                value={mobile}
              />
              <Input
                placeholder="Enter alternative mobile number"
                onChange={(e) => {
                  setAlternate(e.target.value);
                }}
                value={alternate}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => updateTest(id)}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TestsDisplay;
