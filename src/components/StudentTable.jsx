import { TableComponent } from "@/pages/dashboard";

const StudentsTable = () => {
    const TABLE_HEAD = ["First Name", "Last Name", "Grade", "Emergency Contact"];
    const TABLE_ROWS = [
        { id: 1, name: "Alice", lastname: "Johnson", grade: "9th Grade", contact: "(907) 555-0123" },
        { id: 2, name: "Bob", lastname: "Smith", grade: "10th Grade", contact: "(907) 555-0456" },
        { id: 3, name: "Charlie", lastname: "Williams", grade: "11th Grade", contact: "(907) 555-0789" },
        { id: 4, name: "Daisy", lastname: "Brown", grade: "12th Grade", contact: "(907) 555-1011" },
        { id: 5, name: "Eva", lastname: "Jones", grade: "8th Grade", contact: "(907) 555-1213" },
        { id: 6, name: "Frank", lastname: "Davis", grade: "7th Grade", contact: "(907) 555-1415" },
        { id: 7, name: "Grace", lastname: "Miller", grade: "6th Grade", contact: "(907) 555-1617" },
        { id: 8, name: "Hank", lastname: "Wilson", grade: "5th Grade", contact: "(907) 555-1819" },
        { id: 9, name: "Ivy", lastname: "Moore", grade: "4th Grade", contact: "(907) 555-2021" },
        { id: 10, name: "Jack", lastname: "Taylor", grade: "3rd Grade", contact: "(907) 555-2323" },
    ];

    return (
        <TableComponent
            title="Students"
            link="/dashboard/manage"
            tableHead={TABLE_HEAD}
            tableRows={TABLE_ROWS}
        />
    );
};

export default StudentsTable