import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Nunca se deben guardar los componentes
    return false;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // No implementamos almacenamiento
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // Nunca se deben reutilizar los componentes guardados
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // No implementamos la recuperación de componentes guardados
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Aquí puedes agregar lógica para permitir que algunos componentes se reutilicen
    return future.routeConfig === curr.routeConfig;
  }
}
