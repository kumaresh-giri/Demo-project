import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomizePizzaComponent } from '../customize-pizza/customize-pizza.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LocationComponent } from '../location/location.component';
import { MenuComponent } from '../menu/menu.component';
import { MyOrderComponent } from '../my-order/my-order.component';
import { PizzaListComponent } from '../pizza-list/pizza-list.component';
import { ProfileComponent } from '../profile/profile.component';
import { ReviewComponent } from '../review/review.component';
import { TeamComponent } from '../team/team.component';
import { AuthGuard } from '../../service/auth.guard';
import { ChangePasswordComponent } from '../../Pages/change-password/change-password.component';
import { PaymentSuccessComponent } from '../../Pages/payment-success/payment-success.component';
import { OrderDetailsComponent } from '../../Pages/order-details/order-details.component';
import { CategoryComponent } from '../../Pages/category/category.component';
import { PrivacyPolicyComponent } from '../../Pages/privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from '../../Pages/refund-policy/refund-policy.component';
import { MyWishlistComponent } from '../../Pages/my-wishlist/my-wishlist.component';
import { BecomeCodeEnforcerComponent } from '../../Pages/become-code-enforcer/become-code-enforcer.component';
import { DeliveryPolicyComponent } from '../../Pages/delivery-policy/delivery-policy.component';
import { MainCartComponent } from '../main-cart/main-cart.component';

const routes: Routes = [
  {
    path: 'customizepizza',
    component: CustomizePizzaComponent,
    data: { pageTitle: 'Customize Pizza' },
    pathMatch: 'full',
  },
  {
    path: 'customizepizza/:slug',
    component: CustomizePizzaComponent,
    data: { pageTitle: 'Customize Pizza' },
    pathMatch: 'exact',
  },
  {
    path: 'pizza',
    component: PizzaListComponent,
    data: { pageTitle: 'Pizza' },
  },
  {
    path: 'menu',
    component: MenuComponent,
    data: { pageTitle: 'menu' },
  },
  {
    path: 'team',
    component: TeamComponent,
    data: { pageTitle: 'Join Our Team' },
  },
  {
    path: 'review',
    component: ReviewComponent,
    data: { pageTitle: 'Reviews' },
  },
  {
    path: 'location',
    component: LocationComponent,
    data: { pageTitle: 'Locations' },
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    data: { pageTitle: 'Dashboard' },
  },
  {
    path: 'main-cart',
    canActivate: [AuthGuard],
    component: MainCartComponent,
    data: { pageTitle: 'Main Cart' },
  },
  {
    path: 'my-order',
    canActivate: [AuthGuard],
    component: MyOrderComponent,
    data: { pageTitle: 'My Order' },
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: ProfileComponent,
    data: { pageTitle: 'Profile' },
  },
  {
    path: 'my-wishlist',
    canActivate: [AuthGuard],
    component: MyWishlistComponent,
    data: { pageTitle: 'My Wishlist' },
  },
  {
    path: 'change-password',
    canActivate: [AuthGuard],
    component: ChangePasswordComponent,
    data: { pageTitle: 'Change Password' },
  },
  {
    path: 'payment-success/:orderId',
    component: PaymentSuccessComponent,
    data: { pageTitle: 'Payment Success' },
  },
  {
    path: 'payment-success',
    component: PaymentSuccessComponent,
    data: { pageTitle: 'Payment Success' },
  },
  {
    path: 'payment-success/:id/:orderno',
    component: PaymentSuccessComponent,
    data: { pageTitle: 'Payment Success' },
  },
  {
    path: 'order-details/:orderId',
    //canActivate: [AuthGuard],
    component: OrderDetailsComponent,
    data: { pageTitle: 'Order Details' },
  },
  {
    path: 'category/:slug',
    component: CategoryComponent,
    data: { pageTitle: 'Category wise product listing' },
    pathMatch: 'full',
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    data: { pageTitle: 'Privacy Policy' },
  }, 
  {
    path: 'refund-policy',
    component: RefundPolicyComponent,
    data: { pageTitle: 'Refund Policy' },
  }, 
  {
    path: 'delivery-policy',
    component: DeliveryPolicyComponent,
    data: { pageTitle: 'Delivery Policy' },
  }, 
  {
    path: 'become-a-code-enforcer',
    component: BecomeCodeEnforcerComponent,
    data: { pageTitle: 'Become a Code Enforcer' },
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InnerLayoutRoutingModule {}
