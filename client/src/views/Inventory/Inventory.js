import React from 'react';
import { Switch, Route } from 'react-router-dom';

import inventoryRoutes from "routes/inventoryRoutes";

const switchRoutes = (
    <Switch>
        {inventoryRoutes.map((prop, key) => {
            return (
                <Route 
                    exact
                    path={prop.basePath + prop.path}
                    component={(props) => {
                        const Component = prop.component;
                        return <Component title={prop.title} basePath={prop.basePath} {...props} />;
                    }}
                    key={key} />
            );
        })}
    </Switch>
);

export default function Inventory(props) {
    return (
        <div>
            <Switch>
                {switchRoutes}
            </Switch>
        </div>
    );
}