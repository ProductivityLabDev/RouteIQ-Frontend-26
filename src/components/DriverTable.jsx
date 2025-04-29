import { TableComponent } from "@/pages/dashboard";

const DriversTable = () => {
    const TABLE_HEAD = ["First Name", "Last Name", "Grade", "Emergency Contact"];
    const TABLE_ROWS = [
        { id: 1, name: "John", lastname: "Michael", grade: "9th Grade", contact: "(907) 555-0101" },
        { id: 2, name: "Alexa", lastname: "Liras", grade: "11th Grade", contact: "(907) 555-0101" },
        { id: 3, name: "Laurent", lastname: "Perrier", grade: "5th Grade", contact: "(907) 555-0101" },
        { id: 4, name: "Michael", lastname: "Levi", grade: "2nd Grade", contact: "(907) 555-0101" },
        { id: 5, name: "Richard", lastname: "Gran", grade: "1st Grade", contact: "(907) 555-0101" },
        { id: 6, name: "Laurent", lastname: "Perrier", grade: "10th Grade", contact: "(907) 555-0101" },
        { id: 7, name: "Michael", lastname: "Levi", grade: "3rd Grade", contact: "(907) 555-0101" },
        { id: 8, name: "Alexa", lastname: "Liras", grade: "3rd Grade", contact: "(907) 555-0101" },
        { id: 9, name: "Laurent", lastname: "Perrier", grade: "1st Grade", contact: "(907) 555-0101" },
        { id: 10, name: "Michael", lastname: "Levi", grade: "9th Grade", contact: "(907) 555-0101" },
    ];

    return (
        <TableComponent
            title="Drivers"
            link="/dashboard/manage"
            tableHead={TABLE_HEAD}
            tableRows={TABLE_ROWS}
        />
    );
};

export default DriversTable