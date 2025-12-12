import axiosInstance from '../../config/axiosInstance';

const API_URL = 'offices/';

export interface Office {
    _id: string;
    number: string;
    city: string;
    country: string;
    direction: string;
    createdAt: string;
    updatedAt: string;
}

export type OfficeData = Omit<Office, '_id' | 'createdAt' | 'updatedAt'>;

const getOffices = async (): Promise<Office[]> => {
    const response = await axiosInstance.get(API_URL);
    return response.data;
};

//only admin
const createOffice = async (officeData: OfficeData): Promise<Office> => { 
    const { data } = await axiosInstance.post(API_URL, officeData); 
    return data;
};

const deleteOffice = async (officeId: string): Promise<string> => {
    await axiosInstance.delete(API_URL + officeId);
    return officeId; 
};

const officeService = {
    getOffices,
    createOffice,
    deleteOffice,
};

export default officeService;