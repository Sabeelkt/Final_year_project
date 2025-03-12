import React, { useEffect, useState } from "react";
// import { db } from "@/config/firebase";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   doc,
//   Timestamp,
//   deleteDoc,
// } from "firebase/firestore";
import { AiFillDelete, AiFillEye } from "react-icons/ai";
import { Button } from '../../../components/ui/button';
import { LuPlus } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { ImSpinner6 } from "react-icons/im";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { LoadingButton } from "@/components/ui/loading-button";
import { collection,getDocs  } from "firebase/firestore";
import { db } from '@/config/firebase'
const formSchema2 = z.object({
  department: z.string().nonempty("Department is required"),
});

const Dashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const departmentCollectionRef = collection(db, "departments");
  const [isLoading, setIsLoading] = useState({ fetch: true, submit: false, delete: false });
  const [parent] = useAutoAnimate();
  
  const DepartmentForm = useForm({
    resolver: zodResolver(formSchema2),
    defaultValues: { department: "" },
  });

  const fetchDepartments = async () => {
    try {
      const departmentSnapshot = await getDocs(departmentCollectionRef);
      const departments = departmentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      departments.sort((a, b) => a.department.localeCompare(b.department));
      setDepartments(departments);
      setIsLoading((prev) => ({ ...prev, fetch: false }));
    } catch (error) {
      console.error(error);
    }
  };

  const addDepartment = async (values) => {
    setIsLoading((prev) => ({ ...prev, submit: true }));
    try {
      const data = { department: values.department, createdAt: Timestamp.now() };
      await addDoc(departmentCollectionRef, data);
      fetchDepartments();
      setShowDepartmentModal(false);
      DepartmentForm.reset();
    } catch (error) {
      console.error(error);
    }
    setIsLoading((prev) => ({ ...prev, submit: false }));
  };

  const deleteDepartment = async (id) => {
    setIsLoading((prev) => ({ ...prev, delete: true }));
    try {
      await deleteDoc(doc(db, "departments", id));
      fetchDepartments();
    } catch (error) {
      console.error(error);
    }
    setIsLoading((prev) => ({ ...prev, delete: false }));
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="mx-auto mb-10 mt-20 flex h-full max-w-[600px] flex-col items-center gap-10">
      {isLoading.delete && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/50">
          <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
            <div className="flex items-center justify-center gap-4">
              <ImSpinner6 className="h-6 w-6 animate-spin text-emerald-600" />
              <h1 className="font-bold text-emerald-600">Deleting Department...</h1>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-[30px] font-bold text-green-900 dark:text-emerald-400">
        Admin Dashboard
      </h1>

      <Button className="w-full h-[50px] flex gap-4 !bg-emerald-700 font-bold !text-white" onClick={() => setShowDepartmentModal(true)}>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
          <LuPlus className="text-emerald-700" />
        </div>
        Add Department
      </Button>

      <div className="w-full">
        <h2 className="text-center text-xl font-bold dark:text-white">Departments</h2>
        <div className="flex flex-wrap justify-center gap-5" ref={parent}>
          {isLoading.fetch ? (
            Array.from({ length: 4 }).map((_, index) => (
              <p key={index} className="h-20 w-full sm:w-[45%] flex items-center justify-center rounded-md bg-slate-200 animate-pulse">
                <ImSpinner6 className="h-8 w-8 animate-spin text-white" /> Loading
              </p>
            ))
          ) : departments.length > 0 ? (
            departments.map(({ id, department }) => (
              <div key={id} className="w-full sm:w-[48%] flex items-center justify-between rounded-md bg-gray-400 p-4 dark:bg-gray-100">
                <div className="flex items-center gap-2">
                  <AiFillEye className="text-slate-100 dark:text-gray-500" />
                  <span className="font-semibold text-white dark:text-gray-700">{department}</span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <AiFillDelete className="text-red-500" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="dark:text-white">
                        Are you sure you want to delete this department?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. It will permanently delete the department.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="dark:text-white">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteDepartment(id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          ) : (
            <p className="text-center dark:text-white">No Department Found</p>
          )}
        </div>
      </div>

      {/* Add Department Modal */}
      <Dialog open={showDepartmentModal} onOpenChange={setShowDepartmentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-[30px] font-bold dark:text-white">
              Create Department
            </DialogTitle>
          </DialogHeader>
          <div className="max-w-[320px] mx-auto flex flex-col gap-5">
            <Form {...DepartmentForm}>
              <form onSubmit={DepartmentForm.handleSubmit(addDepartment)} className="space-y-4">
                <FormField
                  control={DepartmentForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem ref={parent}>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input className="h-[50px]" placeholder="e.g., BSc Computer Science" {...field} />
                      </FormControl>
                      <FormDescription>This is the department students can select.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pb-4">
                  <Button onClick={() => setShowDepartmentModal(false)} className="!bg-slate-200 !text-emerald-600">Cancel</Button>
                  <LoadingButton className="bg-emerald-600 !text-white hover:bg-emerald-700" loading={isLoading.submit} type="submit">
                    Submit
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
