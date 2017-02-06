import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './app';
import { 
    HomeView, LoginView, ProtectedView, NotFoundView, SignupView,
    ConfirmEmailView, LoggedInView, MapView, AddBuildingView, EditBuildingView,
    PaddedContainer, AddUnitView, EditUnitView, AddReviewView, ListUnitsView, 
    ShowBuildingView, ShowUnitView, FavoritesView, ForgotPasswordView, 
    ResetPasswordView } from './containers';
import { requireAuthentication } from './utils/requireAuthentication';

export default(
    <Route path="/" component={App}>
        <IndexRoute component={LoginView}/>
        <Route path="signup" component={SignupView}/>
        <Route path="confirm/email/:code" component={ConfirmEmailView}/>
        <Route path="forgotpassword" component={ForgotPasswordView}/>
        <Route path="resetpassword" component={ResetPasswordView}/>
        <Route component={LoggedInView}>
            <Route path="home" component={requireAuthentication(HomeView)}/>
            <Route path="map" component={requireAuthentication(MapView)}/>
            <Route component={PaddedContainer}>
                <Route path="building/add" component={requireAuthentication(AddBuildingView)}/>
                <Route path="building/show/:id" component={requireAuthentication(ShowBuildingView)}/>
                <Route path="building/edit/:id" component={requireAuthentication(EditBuildingView)}/>
                <Route path="unit/add" component={requireAuthentication(AddUnitView)}/>
                <Route path="unit/list" component={requireAuthentication(ListUnitsView)}/>
                <Route path="unit/show/:id" component={requireAuthentication(ShowUnitView)}/>
                <Route path="unit/edit/:id" component={requireAuthentication(EditUnitView)}/>
                <Route path="review/add" component={requireAuthentication(AddReviewView)}/>
                <Route path="user/favorites" component={requireAuthentication(FavoritesView)}/>
            </Route>
        </Route>
        <Route path="protected" component={requireAuthentication(ProtectedView)}/>
        <Route path="*" component={NotFoundView}/>
    </Route>
);
