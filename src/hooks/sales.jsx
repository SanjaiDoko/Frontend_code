import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchData } from "../helper";
import { URL } from "../config";

// const newUrl = "http://192.168.0.205:9000"
const newUrl = "http://localhost:9000"


//get companies
const useGetAllCompanies = () => {
  return useQuery({
    queryKey: ["allCompanies"],
    queryFn: () =>
      fetchData({
        url: newUrl + "/company/getAllCompany",
        isAuthRequired: true,
      }),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

// insert companies
const useInsertCompany = (onSuccessFunctions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: newUrl + "/company/addCompany",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      toast.success("Company Added Successfully");
      onSuccessFunctions();
      queryClient.invalidateQueries({
        queryKey: ["allCompanies"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

//get My employee
const useGetMyEmployee = () => {
  return useQuery({
    queryKey: ["myEmployee"],
    queryFn: () =>
      fetchData({
        url: newUrl + "/user/getYourEmployees",
        isAuthRequired: true,
      }),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

//get employee
const useGetAllEmployee = () => {
  return useQuery({
    queryKey: ["allEmployee"],
    queryFn: () =>
      fetchData({
        url: newUrl + "/user/getAllEmployees",
        isAuthRequired: true,
      }),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

//get unassigned employee
const useGetUnAssignedEmployee = () => {
  return useQuery({
    queryKey: ["allUnassignedEmployee"],
    queryFn: () =>
      fetchData({
        url: newUrl + "/user/unAssignedEmployee",
        isAuthRequired: true,
      }),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

//get unassigned employee
const useGetUnAssignedCompany = () => {
  return useQuery({
    queryKey: ["allUnassignedComapny"],
    queryFn: () =>
      fetchData({
        url: newUrl + "/company/unAssignedCompanies",
        isAuthRequired: true,
      }),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

// Assign employee
const useInsertEmployee = (onSuccessFunctions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: newUrl + "/user/createNetwork",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      toast.success("Employee Added Successfully");
      onSuccessFunctions();
      queryClient.invalidateQueries({
        queryKey: ["allEmployee"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myEmployee"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

//get employees by id
const useGetEmployeeById = () => {
  return useQuery({
    queryKey: ["getEmployeeById"],
    queryFn: () =>
      fetchData({
        url: newUrl+"/user/getYourEmployees",
        isAuthRequired: true,
      }),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

// get sales
const useGetAllSales = () => {
  return useQuery({
    queryKey: ["allSales"],
    queryFn: () =>
      fetchData({
        url: newUrl + "/salesCalls/allAssignedCall",
        isAuthRequired: true,
      }),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

//insert sales
const useInsertSales = (onSuccessFunctions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: newUrl+"/salesCalls/assignCall",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      toast.success("Sales Call Created Successfully");
      onSuccessFunctions();
      queryClient.invalidateQueries({
        queryKey: ["allSales"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

//get sales call by assigned person
const useGetSalesCallByAssignee = () => {
  return useQuery({
    queryKey: ["allAssigneeSalesCall"],
    queryFn: () =>
      fetchData({
        url: newUrl + "/salesCalls/getUserCalls",
        isAuthRequired: true,
      }),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

//get sales call by callId
const useGetSalesCallByCallId = (id, onChatSuccessFunction) => {
  return useQuery({
    queryKey: ["allAssigneeSalesCallById"],
    queryFn: () =>
      fetchData(
        {
          url: newUrl + "/salesCalls/getCallById",
          isAuthRequired: true,
          method: "POST"
        },
        {
          data: [
            {
              id,
            },
          ],
        }
      ),
    refetchOnMount: true,
    onSuccess: (data)=>{
      onChatSuccessFunction(data)
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

// insert remarks
const useInsertRemarks = (onSuccessFunctions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: newUrl + "/salesCalls/updateReport",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      onSuccessFunctions();
      queryClient.invalidateQueries({
        queryKey: ["allAssigneeSalesCall"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allAssigneeSalesCallById"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

// get Demo
const useGetDemo = () => {
  return useQuery({
    queryKey: ["allDemo"],
    queryFn: () =>
      fetchData({
        url: newUrl + "/demoCalls/assignedDemos",
        isAuthRequired: true,
      }),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

// get Manger Demo
const useGetMangerDemo = () => {
  return useQuery({
    queryKey: ["managerDemo"],
    queryFn: () =>
      fetchData({
        url: newUrl + "/demoCalls/managerDemo",
        isAuthRequired: true,
      }),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

//insert demo calls
const useInsertDemoCalls = (onSuccessFunctions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: newUrl+"/demoCalls/assignDemo",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      toast.success("Demo Call Created Successfully");
      onSuccessFunctions();
      queryClient.invalidateQueries({
        queryKey: ["allDemo"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

//get my demo
const useGetMyDemo = () => {
  return useQuery({
    queryKey: ["myDemo"],
    queryFn: () =>
      fetchData({
        url: newUrl + "/demoCalls/getMyDemo",
        isAuthRequired: true,
      }),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

//get Demo call by callId
const useGetDemoCallByCallId = (id) => {
  console.log(id)
  return useQuery({
    queryKey: ["demoById"],
    queryFn: () =>
      fetchData(
        {
          url: newUrl + "/demoCalls/getDemoById",
          isAuthRequired: true,
          method: "POST"
        },
        {
          data: [
            {
              id,
            },
          ],
        }
      ),
    refetchOnMount: true,
    
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

// insert remarks
const useInsertDemoRemarks = (onSuccessFunctions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: newUrl + "/demoCalls/updateReport",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      toast.success("Demo Call Updated Successfully");
      onSuccessFunctions();
      queryClient.invalidateQueries({
        queryKey: ["myDemo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["demoById"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};



export {
  useInsertEmployee,
  useGetMyEmployee,
  useGetAllCompanies,
  useInsertCompany,
  useGetAllSales,
  useInsertSales,
  useGetSalesCallByAssignee,
  useGetEmployeeById,
  useGetAllEmployee,
  useGetUnAssignedEmployee,
  useGetUnAssignedCompany,
  useGetSalesCallByCallId,
  useInsertRemarks,
  useGetDemo,
  useInsertDemoCalls,
  useGetMyDemo,
  useGetDemoCallByCallId,
  useInsertDemoRemarks,
  useGetMangerDemo
};
