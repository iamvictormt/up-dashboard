import { MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const newsItems = [
  {
    source: "CNN International",
    title: "Bitcoin, Ethereum Technical Analysis",
    time: "14h ago",
    comments: "124",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    source: "CNBC",
    title: "Vietnam Crypto Miners Complain About Losses From Ethereum's Merge",
    time: "1d ago",
    comments: "423",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function NewsSection() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-[#511A2B]">News</CardTitle>
          <Button variant="ghost" className="text-sm text-[#511A2B]/70 hover:text-[#511A2B] hover:bg-[#511A2B]/10">
            See All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {newsItems.map((item, index) => (
          <div key={index} className="flex space-x-3">
            <Avatar className="w-10 h-10 rounded-xl">
              <AvatarImage src={item.avatar || "/placeholder.svg"} />
              <AvatarFallback className="rounded-xl bg-[#511A2B] text-white">{item.source.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-[#511A2B]">{item.source}</span>
              </div>
              <p className="text-sm text-[#511A2B]/80 line-clamp-2 mb-2">{item.title}</p>
              <div className="flex items-center space-x-4 text-xs text-[#511A2B]/50">
                <span>{item.time}</span>
                <span>{item.comments}</span>
                <MoreHorizontal className="w-3 h-3" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
