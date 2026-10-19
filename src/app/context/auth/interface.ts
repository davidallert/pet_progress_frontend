import User from "@/types/user"

interface AuthContextInterface {
    user: User | null,
    isLoading: boolean,
}

export default AuthContextInterface;