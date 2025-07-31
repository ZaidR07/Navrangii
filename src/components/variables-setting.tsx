import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import VariablesForm from './variables-form'
import ListOfVariables from './list-of-variables'

export default function VariablesSetting({value}: {value: string}) {
  return (
     <TabsContent value={value} className="space-y-6">
              <Tabs defaultValue="form" className="w-full">
                <TabsList className="mb-6 p-1  rounded-xl bg-slate-100 dark:bg-slate-800 gap-2">
                  <TabsTrigger
                    value="form"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6 py-2 rounded-lg text-sm font-medium"
                  >
                    Add Variables
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6 py-2 rounded-lg text-sm font-medium"
                  >
                    List Variables
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="form">
                  <VariablesForm />
                </TabsContent>
                <TabsContent value="list">
                  <ListOfVariables />
                </TabsContent>
              </Tabs>
            </TabsContent>
  )
}
