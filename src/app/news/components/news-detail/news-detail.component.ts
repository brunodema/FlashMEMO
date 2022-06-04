import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailViewComponent } from 'src/app/shared/components/common/detail-view/detail-view.component';
import { News } from '../../models/news.model';
import { GenericNewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent extends DetailViewComponent<News> {

  constructor(protected route : ActivatedRoute, protected service : GenericNewsService) { super(route, service) }


}
