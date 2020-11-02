import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-category-section',
  templateUrl: './category-section.component.html',
  styleUrls: ['./category-section.component.css']
})
export class CategorySectionComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoadiing = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  openViewModal = false;
  postToView: Post;
  firstPost;
  private postsSub: Subscription;
  private authStatusSubs: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isLoadiing = true;
    // this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdatedListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoadiing = false;
        this.totalPosts = postData.postCount;
        // get only the first post
        [this.firstPost] = postData.posts;
        this.posts.push(this.firstPost);
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }

  onDelete(postId: string) {
    this.isLoadiing = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoadiing = false;
    });
  }

  openModal(post) {
    this.openViewModal = true;
    this.postToView = post;
  }

  closeModal() {
    this.openViewModal = false;
    this.postToView = null;
  }

  onPostCategoryClick(categoryNumber) {
    this.router.navigate(
      ['/posts', categoryNumber]
    );
  }
}

