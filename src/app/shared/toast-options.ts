import { ToastOptions } from "ng2-toastr";

export class CustomToastOptions extends ToastOptions {
  public animate = "flyRight";
  public newestOnTop = false;
  public positionClass = "toast-top-center";
}
