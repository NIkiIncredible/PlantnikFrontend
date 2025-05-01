import type {LucideIcon} from "lucide-vue-next";
import type {ComputedRef} from "vue";

export type CheckoutSteps = 'cart' | 'shipping' | 'payment' | 'review';
export type CheckoutStepsProps = {
    prevStep: () => void,
    nextStep: () => void,
    isUserSession: ComputedRef<boolean>,
    isCartLoading: ComputedRef<boolean>,
    isVirtualCart: ComputedRef<boolean>;
    selectedPaymentMethod: WritableComputedRef<string, string>
    selectedShippingMethod: WritableComputedRef<string, string>
    selectedShippingAddress: WritableComputedRef<string, string>
    selectedBillingAddress: WritableComputedRef<string, string>
    refreshShippingMethod: () => void,
    refreshPaymentMethod: () => void,
}
export type CheckoutStep = {
    step: number,
    title: string,
    description: string,
    icon: LucideIcon,
    component: Component,
    props: Partial<CheckoutStepsProps>
}