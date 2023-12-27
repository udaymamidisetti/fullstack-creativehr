import { Button, Input, useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import TestsDisplay from "./TestsDisplay";

const FormOne = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [alternate, setAlternate] = useState("");
  const [testType, setTestType] = useState("");
  const [data, setData] = useState([]);
  const [test, setTest] = useState([]);
  useEffect(() => {
    getAllValues();
    getTests();
  }, []);
  const getAllValues = async () => {
    const response = await fetch("http://localhost:2000/getAllValues");
    const result = await response.json();
    setData(result);
  };
  const getTests = async () => {
    const response = await fetch("http://localhost:2000/gettests");
    const result = await response.json();

    setTest(result);
  };

  const submitTest = async () => {
    if (name === "") {
      toast({
        title: "Name is required",
        position: "top-right",
        isClosable: true,
        status: "error",
      });
      return false;
    }
    if (type === "") {
      toast({
        title: "Please select test type",
        position: "top-right",
        isClosable: true,
        status: "error",
      });
      return false;
    }
    if (email === "") {
      toast({
        title: "Email is required",
        position: "top-right",
        isClosable: true,
        status: "error",
      });
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        position: "top-right",
        isClosable: true,
        status: "error",
      });
      return false;
    }
    if (mobile === "") {
      toast({
        title: "Mobile number is required",
        position: "top-right",
        isClosable: true,
        status: "error",
      });
      return false;
    }
    if (alternate === "") {
      toast({
        title: "Alternate Mobile is required",
        position: "top-right",
        isClosable: true,
        status: "error",
      });
      return false;
    } else if (mobile.length > 10 || alternate.length > 10) {
      toast({
        title: "Invalid mobile number",
        status: "error",
        isClosable: true,
        position: "top-right",
      });
      return false;
    } else if (mobile === alternate) {
      toast({
        title: "Mobile and alternate mobile number should not match",
        position: "top-right",
        isClosable: true,
        status: "error",
      });
      return false;
    }
    const data = {
      Test_name: name,
      Test_type: type,
      tester_email_id: email,
      Tester_mobile_no: mobile,
      Alternative_no: alternate,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const result = await fetch("http://localhost:2000/createtests", options);
    const response = await result.json();
    if (response.res === 1) {
      toast({
        title: response.message,
        status: "success",
        isClosable: true,
        position: "top-right",
      });
    }
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  const submitNewTest = async () => {
    if (testType === "") {
      toast({
        title: "Please Enter test type",
        position: "top-right",
        isClosable: true,
        status: "error",
      });
      return false;
    }
    const data = {
      test_type: testType,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const result = await fetch("http://localhost:2000/createtest", options);
    const response = await result.json();
    if (response.res === 1) {
      toast({
        title: response.message,
        position: "top-right",
        isClosable: true,
      });
    } else if (response.res === 0) {
      toast({
        title: response.message,
        position: "top-right",
        isClosable: true,
        status: "success",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      onClose();
    }
  };

  return (
    <div className="max-w-[700px] m-auto flex flex-col gap-[20px]">
      <h1 className="font-bold text-center text-[20px]">Test</h1>
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
        onBlur={() => {
          if (mobile === alternate) {
            toast({
              title: "Mobile and alternate mobile doesn't match",
              status: "error",
              position: "top-right",
              isClosable: true,
            });
          }
        }}
      />
      <div className="flex justify-center gap-[20px]">
        <Button onClick={submitTest} colorScheme="twitter">
          Submit
        </Button>
        <Button onClick={onOpen} colorScheme="teal">
          Create Test
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="pt-[20px]">
              <h1 className="font-semibold text-[18px]">Enter test name</h1>
              <Input
                className="mt-[10px]"
                onChange={(e) => setTestType(e.target.value)}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={submitNewTest}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TestsDisplay data={data} />
    </div>
  );
};

export default FormOne;
