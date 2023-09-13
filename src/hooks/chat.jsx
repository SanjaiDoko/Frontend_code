import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../helper";
import { URL } from "../config";

const useGetChatById = (id, onSuccessFunctions) =>
  useQuery({
    queryKey: ["chat"],
    queryFn: () => {
      return fetchData(
        {
          url: URL + "user/getChatsByTicketId",
          method: "POST",
          isAuthRequired: true,
        },
        {
          data: [
            {
              id,
            },
          ],
        }
      );
    },
    onSuccess:(data)=>{
        onSuccessFunctions(data)
    },
    onError:(error)=>{
        console.log(error)
    }
  });

  const useInsertChat = () => {
      return useMutation({
          mutationFn: (data) =>{
        fetchData(
          {
            url: URL + "user/insertChat",
            method: "POST",
            isAuthRequired: true,
          },
          { data: [data] }
        )},
    });
  };
  



  export {
    useGetChatById,
    useInsertChat
  };
  