import InventoryRoot from 'views/Inventory/InventoryRoot';
import AddModel from 'views/Inventory/Model/AddModel';
import AllModel from 'views/Inventory/Model/AllModel';
import EditModel from 'views/Inventory/Model/EditModel';
import AddWarehouse from 'views/Inventory/Warehouse/AddWarehouse';
import AllWarehouse from 'views/Inventory/Warehouse/AllWarehouse';
import EditWarehouse from 'views/Inventory/Warehouse/EditWarehouse';
import AddRegion from 'views/Inventory/Region/AddRegion';
import AllRegion from 'views/Inventory/Region/AllRegion';
import AddTerritory from 'views/Inventory/Territory/AddTerritory';
import AllTerritory from 'views/Inventory/Territory/AllTerritory';
import Search from 'views/Inventory/Search';
import GoodsIn from 'views/Inventory/InventoryTransactions/GoodsIn';
import GoodsOut from 'views/Inventory/InventoryTransactions/GoodsOut';
import GoodsTransfer from 'views/Inventory/InventoryTransactions/GoodsTransfer';
import GoodsReturn from 'views/Inventory/InventoryTransactions/GoodsReturn';


const inventoryRoutes = [
  {
    path: '/',
    title: 'Inventory Management',
    component: InventoryRoot,
    basePath: '/app/inventory'
  },
  {
    path: '/model/add',
    title: 'Add Model',
    component: AddModel,
    basePath: '/app/inventory'
  },
  {
    path: '/model/all',
    title: 'All Models',
    component: AllModel,
    basePath: '/app/inventory'
  },
  {
    path: '/model/edit/:id',
    title: 'Edit Model',
    component: EditModel,
    basePath: '/app/inventory'
  },
  {
    path: '/warehouse/add',
    title: 'Add Warehouse',
    component: AddWarehouse,
    basePath: '/app/inventory'
  },
  {
    path: '/warehouse/all',
    title: 'All Warehouses',
    component: AllWarehouse,
    basePath: '/app/inventory'
  },
  {
    path: '/warehouse/edit/:id',
    title: 'Edit Warehouse',
    component: EditWarehouse,
    basePath: '/app/inventory'
  },
  {
    path: '/search',
    title: 'Search',
    component: Search,
    basePath: '/app/inventory'
  },
  {
    path: '/goods-in',
    title: 'Goods In',
    component: GoodsIn,
    basePath: '/app/inventory'
  },
  {
    path: '/goods-out',
    title: 'Goods Out',
    component: GoodsOut,
    basePath: '/app/inventory'
  },
  {
    path: '/goods-transfer',
    title: 'Goods Transfer',
    component: GoodsTransfer,
    basePath: '/app/inventory'
  },
  {
    path: '/goods-return',
    title: 'Goods Return',
    component: GoodsReturn,
    basePath: '/app/inventory'
  },
  {
    path: '/region/add',
    title: 'Add Region',
    component: AddRegion,
    basePath: '/app/inventory'
  },
  {
    path: '/region/all',
    title: 'All Regions',
    component: AllRegion,
    basePath: '/app/inventory'
  },
  {
    path: '/territory/add',
    title: 'Add Territory',
    component: AddTerritory,
    basePath: '/app/inventory'
  },
  {
    path: '/territory/all',
    title: 'All Territories',
    component: AllTerritory,
    basePath: '/app/inventory'
  },
];

export default inventoryRoutes;