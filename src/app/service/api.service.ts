import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http: HttpClient = null;
  public head = new Headers();
  public isLoggedIn = false;
  public currentLocation: any;
  public mapCoords: any;
  base_url = environment.base_url;
  constructor(@Inject(HttpClient) http: HttpClient) {
    this.http = http;
    this.head.set("authorization", localStorage.getItem("token"))
  }

  //post api
  add_new_post(param: any): Observable<any> {
    return this.http.post(environment.add_new_postUrl, param)
  }
  get_all_posts(): Observable<any> {
    return this.http.get(environment.get_all_postsUrl)
  }
  getTrendingPosts(): Observable<any> {
    return this.http.get(environment.get_trending_postsUrl)
  }
  getPostByUserId(id: any): Observable<any> {
    return this.http.get(environment.getPostByUserIdUrl + "/" + id)
  }
  deletePost(id:any): Observable<any> {
    return this.http.delete(environment.deletePostbyIdUrl + "/" + id)
  }
  getpostbyPostid(id): Observable<any> {
    return this.http.get(environment.getPostbyPostidUrl + "/" + id)
  }
  //bookMark
  bookMarkPost(param:any): Observable<any> {
    return this.http.post(environment.bookMarkPostUrl, param)
  }
  getBookMarkedPosts(id): Observable<any> {
    return this.http.get(environment.getBookMarkedPostsUrl + "/" + id)
  }
  removeBookmarkedPost(param:any): Observable<any> {
    return this.http.post(environment.removeBookMarkedPostsUrl, param)
  }
  checkBookmarkedPost(param:any): Observable<any> {
    return this.http.post(environment.checkBookMarkedPostsUrl, param)
  }

  //like new
  LikePost(param:any): Observable<any> {
    return this.http.post(environment.likePostUrl, param)
  }
  getLikePosts(id): Observable<any> {
    return this.http.get(environment.getlikePostsUrl + "/" + id)
  }
  removeLikePost(param:any): Observable<any> {
    return this.http.post(environment.removelikePostsUrl, param)
  }
  checkLikedPost(param:any): Observable<any> {
    return this.http.post(environment.checklikedPostsUrl, param)
  }
  getallLikes(): Observable<any> {
    return this.http.get(environment.getallPostsLikeUrl)
  }
  



  //like
  likePost(param:any): Observable<any> {
    return this.http.post(environment.LikePostUrl, param)
  }
  removelikePost(param:any): Observable<any> {
    return this.http.post(environment.removeLikePostsUrl, param)
  }
  likeUnlikePost(param:any): Observable<any> {
    return this.http.post(environment.LikeUnlikePostUrl, param)
  }
  likeUnlikeComment(param:any): Observable<any> {
    return this.http.post(environment.LikeUnlikeCommentUrl, param)
  }
  //comment
  addCommentPost(param:any): Observable<any> {
    return this.http.post(environment.CommentPostUrl, param)
  }
  replyCommentPost(param:any): Observable<any> {
    return this.http.post(environment.CommentReplyUrl, param)
  }
  reportPost(param:any): Observable<any> {
    return this.http.post(environment.reportPostUrl, param)
  }

  likeCommentReply(postId:any,replyId:any,param:any): Observable<any> {
    return this.http.post(environment.LikeCommentReplyUrl + "/" + postId + "/" +replyId, param)
  }
  unlikeCommentReply(postId:any,replyId:any,param:any): Observable<any> {
    return this.http.post(environment.unLikeCommentReplyUrl + "/" + postId + "/" +replyId, param)
  }

  
  //viewpost
  viewPost(param:any): Observable<any> {
    return this.http.post(environment.ViewPostUrl, param)
  }
  getTaggedPost(id: any): Observable<any> {
    return this.http.get(environment.get_tagged_postUrl + "/" + id)
  }
  getPetPost(petId: any): Observable<any> {
    return this.http.get(environment.get_pet_postUrl + "/" + petId)
  }
  
  


  //Event api
  createEvent(param: any): Observable<any> {
    return this.http.post(environment.createEventUrl, param)
  }
  getEvent(){
    return this.http.get(environment.getEventUrl)
  }
  getEventById(id): Observable<any> {
    return this.http.get(environment.getEventbyIdUrl + "/" + id)
  }
  deleteEvent(id:any): Observable<any> {
    return this.http.delete(environment.deleteEventbyIdUrl + "/" + id)
  }
  //bookmark
  bookMarkEvent(param:any): Observable<any> {
    return this.http.post(environment.bookMarkEventUrl, param)
  }
  getBookMarkedEvents(id): Observable<any> {
    return this.http.get(environment.getBookMarkedEventsUrl + "/" + id)
  }
  removeBookmarked(param:any): Observable<any> {
    return this.http.post(environment.removeBookMarkedEventsUrl, param)
  }
  checkBookmarked(param:any): Observable<any> {
    return this.http.post(environment.checkBookMarkedEventsUrl, param)
  }
  //join
  joinEvent(param:any): Observable<any> {
    return this.http.post(environment.joinEventUrl, param)
  }
  getJoinEventstatus(id, eid): Observable<any> {
    return this.http.get(environment.getJoinEventStatusUrl + "/" + id + "/" + eid)
  }
  getAllJoinedEvents(eid): Observable<any> {
    return this.http.get(environment.getAllJoinedEventsUrl + "/"  + eid)
  }
  //like
  likeEvent(param:any): Observable<any> {
    return this.http.post(environment.LikeEventUrl, param)
  }
  removelike(param:any): Observable<any> {
    return this.http.post(environment.removeLikeEventsUrl, param)
  }
  likeUnlikeEvent(param:any): Observable<any> {
    return this.http.post(environment.LikeUnlikeEventUrl, param)
  }
  //comment
  addCommentEvent(param:any): Observable<any> {
    return this.http.post(environment.CommentEventUrl, param)
  }
  //event type
  addEventType(param: any): Observable<any> {
    return this.http.post(environment.createEventTypeUrl, param)
  }
  getallEventType(){
    return this.http.get(environment.getallEventTypesUrl)
  }
  deleteEventType(id:any): Observable<any> {
    return this.http.delete(environment.deleteEventTypebyIdUrl + "/" + id)
  }
  //view
  viewEvent(param:any): Observable<any> {
    return this.http.post(environment.ViewEventUrl, param)
  }
  getLikeEvents(id): Observable<any> {
    return this.http.get(environment.getlikeEventsUrl + "/" + id)
  }

  

  //Pet Services
  addPet(param: any): Observable<any> {
    return this.http.post(environment.addPetUrl, param)
  }
  updatePetProfile(id, param: any, ): Observable<any> {
    return this.http.post(environment.updatePetProfileUrl + "/" + id, param)
  }
  // getPetById(param:any): Observable<any> {
  //   return this.http.post(environment.getPetbyIdUrl,param)
  // }
  getpetsByUserId(id): Observable<any> {
    return this.http.get(environment.getPetbyUserIdUrl + "/" + id)
  }
  getpetbyid(id): Observable<any> {
    return this.http.get(environment.getPetbyidUrl + "/" + id)
  }
  getDogBreeds(){
    return this.http.get(environment.dogsBreedsUrl)
  }
  getCatBreeds(){
    return this.http.get(environment.catsBreedsUrl)
  }


  
  //adoption user api's
  getUserById(id): Observable<any> {
    return this.http.get(environment.getUserByIdUrl + "/" + id)
  }
  getAllusers(): Observable<any> {
    return this.http.get(environment.getAllUsersUrl)
  }


  //follow unfollow api's
  FollowUser(param:any): Observable<any> {
    return this.http.post(environment.followUserUrl,param)
  }
  UnFollowUser(param:any): Observable<any> {
    return this.http.post(environment.unfollowUserUrl,param)
  }
  FollowPet(param:any): Observable<any> {
    return this.http.post(environment.followPetUrl,param)
  }
  UnFollowPet(param:any): Observable<any> {
    return this.http.post(environment.unfollowPetUrl,param)
  }

  //pet access api's
  givePetAccess(param:any): Observable<any> {
    return this.http.post(environment.givePetAccessUrl,param)
  }
  takePetAccess(param:any): Observable<any> {
    return this.http.post(environment.takePetAccessUrl,param)
  }


  //User services
  login(data: any): Observable<any> {
    return this.http.post(environment.loginUrl, data);
  }
  updateUserDeviceID(email, param: any): Observable<any> {
    return this.http.put(environment.updateUserDeviceIDUrl + "/" + email, param)
  }
  checkUserExists(email:any): Observable<any>{
    return this.http.get(environment.checkUserUrl + "/" + email)
  }
    // signUp(param: any): Observable<any> {
  //   return this.http.post(environment.signUpUrl, param)
  // }
  // googleSignUp(param: any): Observable<any> {
  //   return this.http.post(environment.googleSignUpUrl, param)
  // }
  // getUserByEmailId(email): Observable<any> {
  //   return this.http.get(environment.getUserByEmailIdUrl + "/" + email)
  // }
  // forgotPassword(param: any): Observable<any> {
  //   return this.http.post(environment.forgotPasswordUrl, param)
  // }
  // resetPassword(param: any): Observable<any> {
  //   return this.http.post(environment.resetPasswordUrl, param)
  // }
  // savePassword(param: any): Observable<any> {
  //   return this.http.post(environment.savePasswordUrl, param)
  // }
  // checkExistEmail(email:any){
  //   return this.http.get(environment.checkExistEmail + "/" + email)
  // }
  // checkExistUsername(username:any){
  //   return this.http.get(environment.checkExistUsername + "/" + username)
  // }


  //Nearby Places
  getNearByPlaces(lat:any, long:any, radius:any): Observable<any>{
  // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=18.3697223,74.2664738&radius=150000&ty&key=AIzaSyAYGl-c0UaC0NYwwKTEju3NGGHTYmrPWfQ
    return this.http.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + ',' + long + '&radius=' + radius + '&key=AIzaSyAYGl-c0UaC0NYwwKTEju3NGGHTYmrPWfQ')
  }
}
