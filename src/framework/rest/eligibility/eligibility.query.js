import { useQuery, useMutation, useQueryClient } from "react-query";

import CoreApi from "../../../utils/core-api";
import { API_ENDPOINTS } from "../../../utils/endpoints";

const EligibilityService = new CoreApi();

export const fetchPatientList = async (d) => {
  const { data } = await EligibilityService.findAllPost(API_ENDPOINTS.PATIENT_LIST, d);
  return data;
};

export const usePatientListQuery = (d) => useQuery([API_ENDPOINTS.PATIENT_LIST , d], () => fetchPatientList(d));

export const fetchProviderDataResp = async () => {
  const { data } = await EligibilityService.findAllGet(API_ENDPOINTS.PROVIDER_LIST);
  return {
    ...data,
    data: data.data.map((e) => {
      return {
        ...e,
        providerOption:
          e.doctorName +
          "-" +
          e.deaNumber +
          "-" +
          e.location +
          "-" +
          e.npiId +
          "-" +
          "XXXXX" +
          String(e.ssn).slice(-4),
      };
    }),
  };
};

export const useProviderListQuery = () => useQuery(API_ENDPOINTS.PROVIDER_LIST, fetchProviderDataResp);

export const fetchInsurancePayerList = async (d) => {
  const { data } = await EligibilityService.findAllGet(API_ENDPOINTS.INSURANCE_PAYER_LIST);
  return data;
};

export const useInsurancePayerListQuery = () => useQuery(API_ENDPOINTS.INSURANCE_PAYER_LIST, fetchInsurancePayerList);

export const fetchProcedureCodeList = async (d) => {
  const { data } = await EligibilityService.findAllGet(API_ENDPOINTS.PROCEDURE_CODE_LIST);
  return data;
};

export const useProcedureCodeListQuery = () => useQuery(API_ENDPOINTS.PROCEDURE_CODE_LIST, fetchProcedureCodeList);

export const fetchProcedureTypeList = async (d) => {
  const { data } = await EligibilityService.findAllGet(API_ENDPOINTS.PROCEDURE_CODE_TYPE);
  return data;
};

export const useProcedureTypeListQuery = () => useQuery(API_ENDPOINTS.PROCEDURE_CODE_TYPE, fetchProcedureTypeList);


export const useOcrMutation = () => {
  const queryClient = useQueryClient();

  return useMutation( (data) => EligibilityService.findAllPost(API_ENDPOINTS.OCR, data), {
      onSuccess: (d) => {
      },
      onError : (error) => {
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.OCR);
      },
    }
  );
};

export const fetchPatientBenefitdetails = async (d) => {
  const { data } = await EligibilityService.findAllPost(API_ENDPOINTS.PATIENT_REPORT, d);
  return data;
};

export const usePatientBenefitListdetailsQuery = (d) => useQuery([API_ENDPOINTS.PATIENT_REPORT, d], () => fetchPatientBenefitdetails(d));



export const usePatientGetReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation( (data) => EligibilityService.findAllPost(API_ENDPOINTS.PATIENT_GET_REPORT, data), {
      onSuccess: (d) => {
      },
      onError : (error) => {
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.PATIENT_GET_REPORT);
      },
    }
  );
};

export const usePatientGetBasicReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation( (data) => EligibilityService.findAllPost(API_ENDPOINTS.GET_BASIC_REPORT, data), {
      onSuccess: (d) => {
      },
      onError : (error) => {
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.GET_BASIC_REPORT);
      },
    }
  );
};

export const useAddPatientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation( (data) => EligibilityService.findAllPost(API_ENDPOINTS.ADD_PATIENT, data), {
      onSuccess: (d) => {
      },
      onError : (error) => {
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ADD_PATIENT);
      },
    }
  );
};

export const fetchPatientCalldetails = async (d) => {
  const { data } = await EligibilityService.findAllPost(API_ENDPOINTS.PATIENT_CALL_HISTORY, d);
  return data;
};

export const usePatientCallListQuery = (d) => useQuery([API_ENDPOINTS.PATIENT_CALL_HISTORY, d], () => fetchPatientCalldetails(d));

export const fetchPatientdetail = async (d) => {
  const { data } = await EligibilityService.findAllPost(API_ENDPOINTS.PATIENT_DETAIL, d);
  return data;
};

export const usePatientDetailQuery = (d) => useQuery([API_ENDPOINTS.PATIENT_DETAIL, d], () => fetchPatientdetail(d));

export const useReportMutation = () => {

  const queryClient = useQueryClient();

  return useMutation((data) => EligibilityService.findAllPost(API_ENDPOINTS.PATIENT_REPORT, data), {
    onSuccess: (d) => {
    },
    onError: (error) => {
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PATIENT_REPORT);
    },
  }
  );
};

export const usePatientVerifyMutation = () => {

  const queryClient = useQueryClient();

  return useMutation((d) => EligibilityService.findAllPost(`${API_ENDPOINTS.PATIENT_VERIFY}?uniqueId=${d?.uniqueId}&adminId=${d?.userId}${
    d?.isScheduled && d?.isScheduled !== "undefined" ? `&isScheduled=${d?.isScheduled}` : ""}`, {}), {
    onSuccess: (d) => {
    },
    onError: (error) => {
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PATIENT_VERIFY);
    },
  }
  );
};

export const fetchVerifyPatientUtils = async (d) => {
  const { data } = await EligibilityService.findAllGet(API_ENDPOINTS.VERIFY_PATIENT_UTILS + d?.userId);
  return data;
};

export const useVerifyPatientUtilsQuery = (d) => useQuery([API_ENDPOINTS.VERIFY_PATIENT_UTILS, d], () => fetchVerifyPatientUtils(d));


