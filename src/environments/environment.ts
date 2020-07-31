// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// const apiLink = 'http://localhost:3000/'; //local
const apiLink = 'http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/'; //live
// const apiLink = 'http://pawzeeble.com:3000/'; //live
// const apiLink = 'https://pawzeeble.com:6559/pawzeeble/'; //live server
const apiLink2 = 'http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6559/'; //live server

export const environment = {
  production: false,
  isToggle: false,
  base_url:apiLink,

  //Event
  createEventUrl: apiLink + 'event/create_event',
  getEventUrl: apiLink + 'event/get_event',
  getEventbyIdUrl: apiLink + 'event/getevent_by_id',
  deleteEventbyIdUrl: apiLink + 'event/deleteEvent_by_id',
  //event bookmark
  bookMarkEventUrl: apiLink + 'event/bookmark_event',
  getBookMarkedEventsUrl: apiLink + 'event/get_bookmarked_events',
  removeBookMarkedEventsUrl: apiLink + 'event/remove_bookmarked_event',
  checkBookMarkedEventsUrl: apiLink + 'event/check_isbookmarked',
  //event join
  joinEventUrl: apiLink + 'event/join_event',
  getJoinEventStatusUrl: apiLink + 'event/get_join_status',
  getAllJoinedEventsUrl: apiLink + 'event/get_alljoined_events',
  //event like
  LikeEventUrl: apiLink + 'event/like_event',
  removeLikeEventsUrl: apiLink + 'event/unlike_event',
  LikeUnlikeEventUrl: apiLink + 'event/like_unlike_event',
  //event type
  createEventTypeUrl: apiLink + 'event/add_event_type',
  getallEventTypesUrl: apiLink + 'event/get_all_event_types',
  deleteEventTypebyIdUrl: apiLink + 'event/delete_EventType_by_id',
  //event comments  
  CommentEventUrl: apiLink + 'event/add_comment',
  //event view
  ViewEventUrl: apiLink + 'event/view_event',
  //event like new
  getlikeEventsUrl: apiLink + 'event/get_liked_events',



  //Post api
  add_new_postUrl: apiLink + 'post/create_post',
  get_all_postsUrl: apiLink + 'post/get_all_posts',
  get_trending_postsUrl: apiLink + 'post/get_trending_post',
  getPostByUserIdUrl: apiLink + 'post/getpost_by_id',
  deletePostbyIdUrl: apiLink + 'post/delete_post',
  getPostbyPostidUrl: apiLink + 'post/get_postby_postid',
  //post bookmark
  bookMarkPostUrl: apiLink + 'post/bookmark_post',
  getBookMarkedPostsUrl: apiLink + 'post/get_bookmarked_posts',
  removeBookMarkedPostsUrl: apiLink + 'post/remove_bookmarked_post',
  checkBookMarkedPostsUrl: apiLink + 'post/check_isbookmarked',

  //post like new
  likePostUrl: apiLink + 'post/like',
  getlikePostsUrl: apiLink + 'post/get_liked_posts',
  removelikePostsUrl: apiLink + 'post/unlike',
  checklikedPostsUrl: apiLink + 'post/check_isliked',
  getallPostsLikeUrl: apiLink + 'post/get_all_likes',


  //post like
  LikePostUrl: apiLink + 'post/like_post',
  removeLikePostsUrl: apiLink + 'post/unlike_post',
  LikeUnlikePostUrl: apiLink + 'post/like_unlike_post',
  LikeUnlikeCommentUrl: apiLink + 'post/like_unlike_comment',
  LikeCommentReplyUrl: apiLink + 'post/like_commentreply',
  unLikeCommentReplyUrl: apiLink + 'post/unlike_commentreply',
  //post view
  ViewPostUrl: apiLink + 'post/view_post',
  //post tagged
  get_tagged_postUrl: apiLink + 'post/get_tagged_post',
  get_pet_postUrl: apiLink + 'post/get_pet_post',
  //post comments  
  CommentPostUrl: apiLink + 'post/add_post_comment',
  CommentReplyUrl: apiLink + 'post/add_comment_reply',

  //report
  reportPostUrl: apiLink + 'post/report_post',

  
  //pet api's
  addPetUrl: apiLink + 'pet/addpet',
  getPetbyIdUrl: apiLink + 'pet/pet_profile',
  updatePetProfileUrl: apiLink + 'pet/updatePetProfile',
  dogsBreedsUrl: apiLink + 'pet/get_dog_breeds',
  catsBreedsUrl: apiLink + 'pet/get_cat_breeds',
  getPetbyUserIdUrl: apiLink + 'pet/get_petsby_id',
  getPetbyidUrl: apiLink + 'pet/get_pet',


  //adoption users api
  getUserByIdUrl: apiLink + 'user/getuser_by_id',
  getAllUsersUrl: apiLink + 'user/get_all_users',




  //user
  loginUrl: apiLink + 'user/login',
  updateUserDeviceIDUrl: apiLink + 'user/upadet_user_device_id',
  checkUserUrl: apiLink + 'user/check_user',

  //follow following api's
  followUserUrl: apiLink + 'friends/follow-user',
  unfollowUserUrl: apiLink + 'friends/unfollow-user',
  followPetUrl: apiLink + 'friends/follow-pet',
  unfollowPetUrl: apiLink + 'friends/unfollow-pet',

  //pet access api's
  givePetAccessUrl: apiLink + 'friends/give_petAccess',
  takePetAccessUrl: apiLink + 'friends/take_petAccess',
  
  // signUpUrl: apiLink2 + 'user/register',
  // googleSignUpUrl: apiLink2 + 'user/register_by_google',
  // getUserByEmailIdUrl: apiLink2 + 'user/getuser_by_email',
  // forgotPasswordUrl: apiLink2 + 'user/forgot_password',
  // resetPasswordUrl: apiLink2 + 'user/reset_password',
  // savePasswordUrl: apiLink2 + 'user/save_password',
  // checkExistEmail: apiLink2 + 'user/check_email',
  // checkExistUsername: apiLink2 + 'user/check_username',
  // updateUserUrl: apiLink2 + 'user/upadet_user',
  // updateUserProfileUrl: apiLink2 + 'user/upadet_user_profile',
  // updateUserDeviceIDUrl: apiLink2 + 'user/upadet_user_device_id',

};

