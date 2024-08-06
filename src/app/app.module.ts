import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './Pages/layout/layout.component';
import { HeaderComponent } from './Pages/header/header.component';
import { FooterComponent } from './Pages/footer/footer.component';
import { HomeComponent } from './Pages/home/home.component';
import { InnerLayoutComponent } from './Pages/inner-layout/inner-layout.component';
import { CustomizePizzaComponent } from './Pages/customize-pizza/customize-pizza.component';
import { PizzaListComponent } from './Pages/pizza-list/pizza-list.component';
import { LoginComponent } from './Pages/login/login.component';
import { SignupComponent } from './Pages/signup/signup.component';
import { MenuComponent } from './Pages/menu/menu.component';
import { TeamComponent } from './Pages/team/team.component';
import { LocationComponent } from './Pages/location/location.component';
import { ReviewComponent } from './Pages/review/review.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { MyOrderComponent } from './Pages/my-order/my-order.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CustomPaginationComponent } from './Pages/custom-pagination/custom-pagination.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxStarRatingModule } from 'ngx-star-rating'
import { CartComponent } from './Pages/cart/cart.component';
import { VerifyEmailComponent } from './Pages/verify-email/verify-email.component';
import { ChangePasswordComponent } from './Pages/change-password/change-password.component';
import { MyaccountLeftSidebarComponent } from './Pages/myaccount-left-sidebar/myaccount-left-sidebar.component';
import { ProfilePictureComponent } from './Pages/profile-picture/profile-picture.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SocialLoginComponent } from './Pages/social-login/social-login.component';
import { CheckoutComponent } from './Pages/checkout/checkout.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxPayPalModule } from 'ngx-paypal';
import { OrderDetailsComponent } from './Pages/order-details/order-details.component';
import { PaymentSuccessComponent } from './Pages/payment-success/payment-success.component';
import { CategoryComponent } from './Pages/category/category.component';
import { PrivacyPolicyComponent } from './Pages/privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './Pages/refund-policy/refund-policy.component';
import { MyWishlistComponent } from './Pages/my-wishlist/my-wishlist.component';
import { BecomeCodeEnforcerComponent } from './Pages/become-code-enforcer/become-code-enforcer.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TooltipModule } from 'ng2-tooltip-directive';
import { FooterSocialLoginComponent } from './Pages/footer-social-login/footer-social-login.component';
import { MainCartComponent } from './Pages/main-cart/main-cart.component';
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    InnerLayoutComponent,
    CustomizePizzaComponent,
    PizzaListComponent,
    LoginComponent,
    SignupComponent,
    MenuComponent,
    TeamComponent,
    LocationComponent,
    ReviewComponent,
    DashboardComponent,
    MyOrderComponent,
    ProfileComponent,
    CustomPaginationComponent,
    CartComponent,
    VerifyEmailComponent,
    ChangePasswordComponent,
    MyaccountLeftSidebarComponent,
    ProfilePictureComponent,
    SocialLoginComponent,
    CheckoutComponent,
    OrderDetailsComponent,
    PaymentSuccessComponent,
    CategoryComponent,
    PrivacyPolicyComponent,
    RefundPolicyComponent,
    MyWishlistComponent,
    BecomeCodeEnforcerComponent,
    FooterSocialLoginComponent,
    MainCartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    NgxSpinnerModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ImageCropperModule,
    NgxPayPalModule,
    GooglePlaceModule,
    NgxStarRatingModule,
    TooltipModule,
    NgxCaptchaModule 

  ],
  providers: [
    // {
    //   provide: AuthServiceConfig,
    //   useFactory: getAuthServiceConfigs
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


