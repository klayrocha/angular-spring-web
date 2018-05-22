import { User } from './../../model/user';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { HELP_DESK_API } from '../helpdesk.api';

@Injectable()
export class UserService {
  
  constructor(private http: HttpClient) {}

  login(user: User){
    return this.http.post(`${HELP_DESK_API}/api/auth`,user);
  }

  createOrUpdate(user: User){
    if(user.id != null && user.id != ''){
      return this.http.put(`${HELP_DESK_API}/api/user`,user);
    } else {
      user.id = null;
      return this.http.post(`${HELP_DESK_API}/api/user`, user);
    }
  }

  findAll(page:number,count:number){
    return this.http.get(`${HELP_DESK_API}/api/user/${page}/${count}`);
  }

  findById(id:string){
    return this.http.get(`${HELP_DESK_API}/api/user/${id}`);
  }

  delete(id:string){
    return this.http.delete(`${HELP_DESK_API}/api/user/${id}`);
  }
}
