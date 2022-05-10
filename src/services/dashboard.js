import request from "@/utils/request";

//get dashboard data

export function fetchDashboard(){
    return request('/admin/index')
}