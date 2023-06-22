import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IAddAppraiser, IAddCustomerContact, IAddCustomerPaymentDtls, IAddFileClaim, IChangePassword, IDeleteAdjuster, IDeleteAppraiser, IUpdateAdjuster, IUpdateAppraiser, IUpdateCustomerContact, IUpdateCustomerPaymentDetails, IUpdateFileClaim } from '../features/features.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Content-Type': 'application/json; charset=utf-8',
        withCredentials: 'true'
    }),
};


@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private API: string;
    private apiUrl = 'http://202.129.196.139:8080/api/Reports/PoliceReport';

    constructor(private http: HttpClient) {
        this.API = environment.baseApiUrl
    }


    getAllFileClaims(): Observable<any>{
        return this.http.get<any>(
            this.API + 'Fileclaims/GetAllFileClaims',
            httpOptions
          );
    }

    addfileclaim(request:any): Observable<IAddFileClaim>{
        return this.http.post<IAddFileClaim>(
            this.API + 'Fileclaims/Addfileclaim',request, httpOptions
        );

    }

    deletefileclaim(Id:any,user:any,request:any): Observable<any>{
        return this.http.post<any>(this.API + 'Fileclaims/Deletefileclaim?Id='+ Id +'&ModifiedBy='+ user, request);
    }

    updatefileclaim(request:any): Observable<IUpdateFileClaim>{
        return this.http.post<IUpdateFileClaim>(this.API + 'Fileclaims/Updatefileclaim', request, httpOptions)
    }

    getDuplicateFileClaim(tonTowReportId:any):Observable<any>{
        return this.http.get<any>(this.API + 'Fileclaims/GetDuplicateFileClaim?TonTowReportId=' + tonTowReportId, httpOptions)
    }

    getAllAppraiser():Observable<any>{
        return this.http.get<any>(this.API + 'Appraiser/GetAllAppraiser', httpOptions);
    }

    addAppraiser(request:any):Observable<IAddAppraiser>{
        return this.http.post<IAddAppraiser>(this.API +'Appraiser/AddAppraiser', request, httpOptions );
    }

    deleteAppraiser(request:any): Observable<IDeleteAppraiser>{
        return this.http.post<IDeleteAppraiser>(this.API + 'Appraiser/DeleteAppraiser', request, httpOptions);
    }

    updateAppraiser(request:any): Observable<IUpdateAppraiser>{
        return this.http.post<IUpdateAppraiser>(this.API + 'Appraiser/UpdateAppraiser',request,httpOptions)
    }

    getUserAppraiser(tonTowReportId:any):Observable<any>{
        return this.http.get<any>(this.API + 'Appraiser/GetUserAppraiser?TonTowReportId=' + tonTowReportId, httpOptions);
    }

    getDuplicateAppraiser(tonTowReportId:any):Observable<any>{
        return this.http.get<any>(this.API + 'Appraiser/GetDuplicateAppraiser?TonTowReportId=' + tonTowReportId, httpOptions)
    }

    getAllAdjuster():Observable<any>{
        return this.http.get<any>(this.API + 'Adjuster/GetAllAdjuster', httpOptions);
    }

    addAdjuster(request:any):Observable<any>{
        return this.http.post<any>(this.API + 'Adjuster/AddAdjuster', request, httpOptions);

    }

    updateAdjuster(request:any):Observable<IUpdateAdjuster>{
        return this.http.post<IUpdateAdjuster>(this.API + 'Adjuster/UpdateAdjuster', request, httpOptions)
    }

    deleteAdjuster(request:any):Observable<IDeleteAdjuster>{
        return this.http.post<IDeleteAdjuster>(this.API + 'Adjuster/DeleteAdjuster', request, httpOptions);
    }

    getUserAdjuster(tonTowReportId:any): Observable<any>{
        return this.http.get<any>(this.API + 'Adjuster/GetUserAdjuster?TonTowReportId=' + tonTowReportId, httpOptions);
    }

    getDuplicateAdjuster(tonTowReportId:any):Observable<any>{
        return this.http.get<any>(this.API + 'Adjuster/GetDuplicateAdjuster?TonTowReportId=' + tonTowReportId, httpOptions)
    }

    getAllCustomerPaymentDtls(): Observable<any>{
        return this.http.get<any>(this.API + 'Customerpaymentdtls/GetAllCustomerPaymentDtls', httpOptions);
    }

    getUserCustomerPaymentDtls(tonTowReportId:any, request:any):Observable<any>{
        return this.http.get<any>(this.API + 'Customerpaymentdtls/GetUserCustomerPaymentDtls?TonTowRptId=' + tonTowReportId, request);
    }

    addCustomerPaymentDtls(request:any):Observable<IAddCustomerPaymentDtls>{
        return this.http.post<IAddCustomerPaymentDtls>(this.API + 'Customerpaymentdtls/AddCustomerPaymentDtls', request, httpOptions);
    }

    deleteCustomerPaymentDtls(request:any): Observable<any>{
        return this.http.post<any>(this.API + 'Customerpaymentdtls/DeleteCustomerPaymentDtls', request, httpOptions);
    }

    getDuplicateCustomerPaymentDtls(tonTowReportId:any):Observable<any>{
        return this.http.get<any>(this.API + 'Customerpaymentdtls/GetDuplicateCustomerPaymentDtls?TonTowReportId=' + tonTowReportId, httpOptions)
    }

    updateCustomerPaymentDtls(request:any):Observable<IUpdateCustomerPaymentDetails>{
        return this.http.post<IUpdateCustomerPaymentDetails>(this.API + 'Customerpaymentdtls/UpdateCustomerPaymentDtls', request, httpOptions)
    }

    getTonTowPoliceReportDropDown(): Observable<any>{
        return this.http.get<any>(this.API + 'PoliceReport/GetTonTowPoliceReportDropDown', httpOptions)
    }

    getAllCustInsuranceCompUpdates():Observable<any>{
        return this.http.get<any>(this.API + 'CustInsurance/GetAllCustInsuranceCompUpdates',httpOptions)
    }

    getUserCustInsuranceCompUpdates(tonTowReportId:any, request:any): Observable<any>{
        return this.http.get<any>(this.API + 'CustInsurance/GetUserCustInsuranceCompUpdates?TonTowRptId=' + tonTowReportId , request)
    }

    addCustInsuranceCompUpdates(request:any):Observable<IAddCustomerContact>{
        return this.http.post<IAddCustomerContact>(this.API + 'CustInsurance/AddCustInsuranceCompUpdates',request, httpOptions);

    }

    updateCustInsuranceCompUpdates(request:any):Observable<IUpdateCustomerContact>{
        return this.http.post<IUpdateCustomerContact>(this.API + 'CustInsurance/UpdateCustInsuranceCompUpdates', request, httpOptions)
    }

    deleteCustInsuranceCompUpdates(request:any):Observable<any>{
        return this.http.post<any>(this.API + 'CustInsurance/DeleteCustInsuranceCompUpdates', request, httpOptions)

    }

    getDuplicateCustInsuranceCompUpdates(tonTowReportId:any):Observable<any>{
        return this.http.get<any>(this.API + 'CustInsurance/GetDuplicateCustInsuranceCompUpdates?TonTowReportId=' + tonTowReportId, httpOptions)
    }

    uploadTonTowReports(tonTowReportId:any, jobNum:any,username:any,fileType:any, file:any ):Observable<any>{
        let formData:FormData = new FormData();
        formData.append('FileData', file, file.name)
        return this.http.post<any>(this.API + 'FileUploader/UploadTonTowReports?tonTowReportId=' + tonTowReportId + '&JobNum=' + jobNum + '&userName='+ username + '&FileType=' + fileType, formData )
    }

    getUserFiles(tonTowReportId:any):Observable<any>{
        return this.http.get<any>(this.API + 'FileUploader/GetUserFiles?TonTowRptId=' + tonTowReportId, httpOptions )
    }

    // donwloadFile(reportFileName: string, pdfFilename: string,
    //     request:any):Observable<Blob>{
    //     const url = `${this.apiUrl}?reportFileName=${reportFileName}&pdfFilename=${pdfFilename}`;

    //     return this.http.post<Blob>(url, request, httpOptions);
    // }

    downloadReport(reportFileName: string, pdfFilename: string,
        requestBody:any): Observable<Blob> {
        const requestOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
          }),
          responseType: 'blob' as 'json'
        };
      
        const url = `${this.apiUrl}?reportFileName=${reportFileName}&pdfFilename=${pdfFilename}`;
      
        return this.http.post<Blob>(url, requestBody, requestOptions);
      }
      
      

    addPoliceReport(request:any):Observable<any>{
        let requesthttpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                withCredentials: 'true'
            }),
        };
        return this.http.post<any>(this.API + 'PoliceReport/AddPoliceReport', request, requesthttpOptions)
    }

    getAllPoliceReport():Observable<any>{
        return this.http.get<any>(this.API + 'PoliceReport/GetAllPoliceReport', httpOptions)
    }

    updatePoliceReport(request:any):Observable<any>{
        return this.http.post<any>(this.API + 'PoliceReport/UpdatePoliceReport',request, httpOptions)
    }

    getTonTowPoliceReportStatus(tonTowReportId:any):Observable<any>{
        return this.http.get<any>(this.API + 'PoliceReport/GetTonTowPoliceReportStatus?TonTowRptId=' + tonTowReportId, httpOptions)
    }

    checkDuplicatePoliceReport(JobNum:any):Observable<any>{
        return this.http.get<any>(this.API + 'PoliceReport/CheckDuplicatePoliceReport?JobNum=' + JobNum, httpOptions )
    }

    deletePoliceReport(request:any):Observable<any>{
        return this.http.post<any>(this.API + 'PoliceReport/DeletePoliceReport', request, httpOptions)
    }

    downloadTonTowFiles(jobNum: any, fileName :any): Observable<Blob> {
 
        const url = `${this.API}FileUploader/DownloadFile?jobNo=${jobNum}&fileName=${fileName}`;
        return this.http.get(url, { responseType: 'blob' });
    }

    getUserPoliceReportByID(id:number):Observable<any>{
        return this.http.get<any>(this.API + 'PoliceReport/GetUserPoliceReport?TonTowRptId='+ id, httpOptions)
    }

    forgetPassword(userName:any):Observable<any>{
        return this.http.get<any>(this.API + 'Auth/ForgetPassword?userName=' + userName, httpOptions)
    }

    changePassword(request:any):Observable<any>{
        return this.http.post<any>(this.API + 'Auth/ChangePassword', request, httpOptions)
    }

    getPoliceReportEmailPhone(tonTowReportId:any):Observable<any>{
        return this.http.get<any>(this.API + 'PoliceReport/GetPoliceReportEmailPhone?TonTowRptId=' + tonTowReportId, httpOptions )
    }

    checkDuplicateEmail(email:any):Observable<any>{
        return this.http.get<any>(this.API + 'PoliceReport/CheckDuplicateEmail?Email=' + email, httpOptions)
    }

    checkDuplicatePhone(phone:any):Observable<any>{
        return this.http.get<any>(this.API + 'PoliceReport/CheckDuplicatePhone?Phone=' + phone, httpOptions)
    }

    checkEditDuplicateEmail(email:any, tonTowReportId:any):Observable<any>{
        return this.http.get<any>(this.API + 'PoliceReport/CheckEditDuplicateEmail?Email=' + email + '&TonTowRptId=' + tonTowReportId, httpOptions)
    }

    checkEditDuplicatePhone(phone:any,tonTowReportId:any):Observable<any>{
        return this.http.get<any>(this.API + 'PoliceReport/CheckEditDuplicatePhone?Phone=' + phone + '&TonTowRptId=' + tonTowReportId, httpOptions)
    }

    deletePoliceReportOperatorDtls(id:any):Observable<any>{
        return this.http.post(this.API + 'PoliceReport/DeletePoliceReportOperatorDtls?Id=' +  id, httpOptions)
    }

    deletePoliceReportWitnessDtls(id:any):Observable<any>{
        return this.http.post(this.API + 'PoliceReport/DeletePoliceReportWitnessDtls?Id=' +  id, httpOptions)
    }
    
    deletePoliceReportPropertyDamageDtls(id:any):Observable<any>{
        return this.http.post(this.API + 'PoliceReport/DeletePoliceReportPropertyDamageDtls?Id=' +  id, httpOptions)
    }

    registeruser(request:any):Observable<any>{
        return this.http.post<any>(this.API + 'PoliceReport/registeruser', request , httpOptions)

    }

    getAdminUsers():Observable<any>{
        return this.http.get<any>(this.API + 'PoliceReport/GetAdminUsers', httpOptions)
    }

    deactivateAdminUser(userId:any):Observable<any>{
        return this.http.post<any>(this.API + 'PoliceReport/DeactivateAdminUser?UserId=' + userId, httpOptions)
    }
    
}
