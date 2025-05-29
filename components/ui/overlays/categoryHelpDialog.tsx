"use client";

import { Button } from "@/components/ui/forms/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/overlays/dialog";
import { categoryData } from "@/src/constants/categoryData";
import { regionTreeData } from "@/src/constants/regionTreeData";
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react";
import { useState } from "react";

export function CategoryHelpDialog() {
  // 상태는 이 컴포넌트에서 독립적으로 관리
  const [expandedLarge, setExpandedLarge] = useState<string[]>([]);
  const [expandedMiddle, setExpandedMiddle] = useState<string[]>([]);
  const [expandedDistricts, setExpandedDistricts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"업종" | "지역">("업종");

  // 대분류 토글
  const toggleLarge = (category: string) => {
    setExpandedLarge(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // 중분류 토글
  const toggleMiddle = (category: string) => {
    setExpandedMiddle(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };


  // 구 토글
  const toggleDistrict = (district: string) => {
    setExpandedDistricts(prev =>
      prev.includes(district)
        ? prev.filter(d => d !== district)
        : [...prev, district]
    );
  };

  // 모두 펼치기/접기
  const toggleAllCategories = (expand: boolean) => {
    if (expand) {
      const allLarge = categoryData.map(item => item.category_large);
      const allMiddle = categoryData.flatMap(large => 
        large.categories.map(middle => `${large.category_large}-${middle.category_middle}`)
      );
      // 모든 구 펼치기 (지역)
      const allDistricts = regionTreeData.flatMap(city => city.districts.map(d => d.district));
      setExpandedLarge(allLarge);
      setExpandedMiddle(allMiddle);
      setExpandedDistricts(allDistricts);
    } else {
      setExpandedLarge([]);
      setExpandedMiddle([]);
      setExpandedDistricts([]);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">카테고리 도움말</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
          <DialogTitle>업종/지역 카테고리 목록</DialogTitle>
          <DialogDescription>
            업종과 지역을 조합해서 AI에게 질문해보세요!<br />
            예시: "마포구 공덕동에 디저트 카페 추천해줘"
          </DialogDescription>
        </DialogHeader>
        {/* 탭 버튼 */}
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant={activeTab === "업종" ? "default" : "outline"}
            onClick={() => setActiveTab("업종")}
          >
            업종 카테고리
          </Button>
          <Button
            size="sm"
            variant={activeTab === "지역" ? "default" : "outline"}
            onClick={() => setActiveTab("지역")}
          >
            지역 카테고리
          </Button>
        </div>
        {/* 펼치기/접기 버튼 */}
        <div className="mb-4">
          <Button size="sm" variant="outline" onClick={() => toggleAllCategories(true)}>모두 펼치기</Button>
          <Button size="sm" variant="outline" onClick={() => toggleAllCategories(false)}>모두 접기</Button>
        </div>
        {/* 카테고리 뷰 */}
        {activeTab === "업종" && (
        <div>
            <h3 className="text-base font-semibold mb-2">[업종 카테고리]</h3>
            <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-2">
                {categoryData.map((largeCategory) => (
                <div key={largeCategory.category_large} className="border rounded-lg p-2">
                    <div 
                    className="flex items-center gap-2 cursor-pointer p-1 hover:bg-muted"
                    onClick={() => toggleLarge(largeCategory.category_large)}
                    >
                    {expandedLarge.includes(largeCategory.category_large) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />}
                    <span className="font-semibold">{largeCategory.category_large}</span>
                    </div>
                    
                    {expandedLarge.includes(largeCategory.category_large) && (
                    <div className="ml-6 space-y-1 mt-1">
                        {largeCategory.categories.map((middleCategory) => (
                        <div key={`${largeCategory.category_large}-${middleCategory.category_middle}`}>
                            <div 
                            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-muted"
                            onClick={() => toggleMiddle(`${largeCategory.category_large}-${middleCategory.category_middle}`)}
                            >
                            {expandedMiddle.includes(`${largeCategory.category_large}-${middleCategory.category_middle}`) ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />}
                            <span>{middleCategory.category_middle}</span>
                            </div>
                            
                            {expandedMiddle.includes(`${largeCategory.category_large}-${middleCategory.category_middle}`) && (
                            <div className="ml-6 grid grid-cols-2 gap-1 mt-1">
                                {middleCategory.category_smalls.map((smallCategory) => (
                                <div key={smallCategory} className="text-sm text-muted-foreground p-1">
                                    • {smallCategory}
                                </div>
                                ))}
                            </div>
                            )}
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                ))}
            </div>
            </ScrollArea>
        </div>
        )}
        {activeTab === "지역" && (
        <div>
          <h3 className="text-base font-semibold mb-2">[지역 카테고리]</h3>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-2">
              {regionTreeData.map(city => (
                <div key={city.city} className="border rounded-lg p-2">
                  <div className="font-bold mb-1">{city.city}</div>
                  <div className="ml-3 space-y-1">
                    {city.districts.map(district => (
                      <div key={district.district}>
                        <div
                          className="flex items-center gap-2 cursor-pointer p-1 hover:bg-muted"
                          onClick={() => toggleDistrict(district.district)}
                        >
                          {expandedDistricts.includes(district.district) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />}
                          <span className="font-medium">{district.district}</span>
                        </div>
                        {expandedDistricts.includes(district.district) && (
                          <div className="ml-6 flex flex-wrap gap-1 mt-1">
                            {district.neighborhoods.map(nh => (
                              <span key={nh} className="bg-muted text-xs rounded px-2 py-0.5">{nh}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}