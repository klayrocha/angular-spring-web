import { Ticket } from './../../model/ticket';
import { ResponseApi } from './../../model/response-api';
import { SharedService } from './../../services/shared.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialog.service';
import { TicketService } from '../../services/ticket/ticket.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {

  assignedToMe: boolean = false;
  page:number=0;
  count:number=5;
  pages:Array<number>;
  shared : SharedService;
  message : {};
  classCss : {};
  listTicket=[];
  ticketFilter = new Ticket('',null,'','','','',null,null,'',null);

  constructor(
    private dialogService: DialogService,
    private ticketService: TicketService,
    private router: Router) { 
      this.shared = SharedService.getInstance();
  }

  ngOnInit() {
    this.findAll(this.page,this.count);
  }

  findAll(page:number,count:number){
    this.ticketService.findAll(page,count).subscribe((responseApi:ResponseApi) => {
        this.listTicket = responseApi['data']['content'];
        this.pages = new Array(responseApi['data']['totalPages']);
    } , err => {
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

  filter(): void {
    console.log(' this.assignedToMe --> ',this.assignedToMe);
    this.page = 0;
    this.count = 5;
    this.ticketService.findByParams(this.page,this.count,this.assignedToMe,this.ticketFilter)
    .subscribe((responseApi:ResponseApi) => {
      this.ticketFilter.title = this.ticketFilter.title == 'uninformed' ? "" : this.ticketFilter.title;
      this.ticketFilter.number = this.ticketFilter.number == 0 ? null : this.ticketFilter.number;  
      this.listTicket = responseApi['data']['content'];
        this.pages = new Array(responseApi['data']['totalPages']);
    } , err => {
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

  cleanFilter(): void {
    this.assignedToMe = false;
    this.page = 0;
    this.count = 5;
    this.ticketFilter = new Ticket('',null,'','','','',null,null,'',null);
    this.findAll(this.page,this.count);
  }


  edit(id:string){
    this.router.navigate(['/ticket-new',id]);
  }

  detail(id:string){
    this.router.navigate(['/ticket-detail',id]);
  }

  delete(id:string){
    this.dialogService.confirm('Do you want to delete the ticket ?')
      .then((candelete:boolean) => {
          if(candelete){
            this.message = {};
            this.ticketService.delete(id).subscribe((responseApi:ResponseApi) => {
                this.showMessage({
                  type: 'success',
                  text: `Record deleted`
                });
                this.findAll(this.page,this.count);
            } , err => {
              this.showMessage({
                type: 'error',
                text: err['error']['errors'][0]
              });
            });
          }
      });
  }

  setNextPage(event:any){
    event.preventDefault();
    if(this.page+1 < this.pages.length){
      this.page =  this.page +1;
      this.findAll(this.page,this.count);
    }
  }

  setPreviousPage(event:any){
    event.preventDefault();
    if(this.page > 0){
      this.page =  this.page - 1;
      this.findAll(this.page,this.count);
    }
  }

  setPage(i,event:any){
    event.preventDefault();
    this.page = i;
    this.findAll(this.page,this.count);
  }

  private showMessage(message: {type: string, text: string}): void {
    this.message = message;
    this.buildClasses(message.type);
    setTimeout(() => {
      this.message = undefined;
    }, 3000);
  }

  private buildClasses(type: string): void {
    this.classCss = {
      'alert': true
    }
    this.classCss['alert-'+type] =  true;
  }
  
}
